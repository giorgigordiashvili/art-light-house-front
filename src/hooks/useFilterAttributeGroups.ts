import { useCallback, useEffect, useMemo, useState } from "react";
import { ecommerceClientAttributesList } from "@/api/generated/api";
import { AttributeDefinition } from "@/api/generated/interfaces";
import { Locale } from "@/config/i18n";

const CATEGORY_KEYS = ["category", "categories", "category_id", "categoryid"];

type AttributeCacheRecord = {
  data: AttributeDefinition[] | null;
  promise: Promise<AttributeDefinition[]> | null;
};

type AttributeOptionSource = Record<string, any>;

let attributeKeyMapCache: Map<number, AttributeDefinition> | null = null;

export interface FilterGroupOption {
  attributeId: number;
  attributeKey: string;
  optionId: string;
  label: string;
  categoryId?: number;
}

export interface FilterGroup {
  id: number;
  key: string;
  title: string;
  isCategoryGroup: boolean;
  options: FilterGroupOption[];
}

export interface UseFilterAttributeGroupsResult {
  groups: FilterGroup[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const getGlobalCache = (): AttributeCacheRecord => {
  const anyGlobal = globalThis as unknown as { __filterAttributeCache?: AttributeCacheRecord };
  if (!anyGlobal.__filterAttributeCache) {
    anyGlobal.__filterAttributeCache = { data: null, promise: null };
  }
  return anyGlobal.__filterAttributeCache;
};

const isCategoryAttribute = (attribute: AttributeDefinition) => {
  const key = (attribute.key || "").toLowerCase();
  return CATEGORY_KEYS.some((candidate) => key.includes(candidate));
};

const extractOptions = (attribute: AttributeDefinition): AttributeOptionSource[] => {
  const options = attribute.options;
  if (!options) return [];
  if (Array.isArray(options)) return options as AttributeOptionSource[];

  if (Array.isArray((options as AttributeOptionSource).choices)) {
    return ((options as AttributeOptionSource).choices ?? []) as AttributeOptionSource[];
  }

  if (Array.isArray((options as AttributeOptionSource).values)) {
    return ((options as AttributeOptionSource).values ?? []) as AttributeOptionSource[];
  }

  if (Array.isArray((options as AttributeOptionSource).options)) {
    return ((options as AttributeOptionSource).options ?? []) as AttributeOptionSource[];
  }

  return [];
};

const getTextFromValue = (value: any, language: Locale): string | undefined => {
  if (!value) return undefined;

  if (typeof value === "string" || typeof value === "number") {
    return String(value);
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const label = getTextFromValue(item, language);
      if (label) return label;
    }
    return undefined;
  }

  if (typeof value === "object") {
    const localePriority: Array<string> = [
      language,
      language === "ge" ? "ka" : "ge",
      "ge",
      "ka",
      "en",
    ];

    for (const locale of localePriority) {
      if (typeof value[locale] === "string" && value[locale]) {
        return value[locale];
      }
    }

    const fallbackKeys = ["name", "label", "title", "value", "text", "translation", "translations"];
    for (const key of fallbackKeys) {
      const nested = value[key];
      if (nested) {
        const label = getTextFromValue(nested, language);
        if (label) return label;
      }
    }
  }

  return undefined;
};

const normalizeOptions = (
  attribute: AttributeDefinition,
  language: Locale
): FilterGroupOption[] => {
  const rawOptions = extractOptions(attribute);
  if (!rawOptions.length) return [];

  const isCategory = isCategoryAttribute(attribute);

  return rawOptions
    .map((option) => {
      const optionIdCandidate =
        option?.value_id ??
        option?.valueId ??
        option?.id ??
        option?.option_id ??
        option?.optionId ??
        option?.key ??
        option?.slug ??
        (typeof option?.value === "string" || typeof option?.value === "number"
          ? option.value
          : undefined);

      if (optionIdCandidate === undefined || optionIdCandidate === null) {
        return null;
      }

      const label =
        getTextFromValue(option?.label, language) ??
        getTextFromValue(option, language) ??
        getTextFromValue(option?.name, language) ??
        getTextFromValue(option?.title, language) ??
        getTextFromValue(option?.value, language) ??
        (typeof option === "string" || typeof option === "number" ? String(option) : undefined);

      if (!label) {
        return null;
      }

      const optionId = String(optionIdCandidate);
      const attributeKey = attribute.key || `attribute-${attribute.id}`;

      const baseOption: FilterGroupOption = {
        attributeId: attribute.id,
        attributeKey,
        optionId,
        label,
      };

      if (isCategory) {
        const rawCategoryId =
          option?.category_id ??
          option?.categoryId ??
          option?.value_id ??
          option?.id ??
          optionIdCandidate;
        const parsedCategoryId = Number(rawCategoryId);
        if (Number.isFinite(parsedCategoryId)) {
          return {
            ...baseOption,
            categoryId: parsedCategoryId,
          };
        }
        // fall back to treating as a regular attribute option when no numeric category id is available
        return baseOption;
      }

      return baseOption;
    })
    .filter(Boolean) as FilterGroupOption[];
};

const fetchAttributeDefinitions = async (force = false): Promise<AttributeDefinition[]> => {
  const cache = getGlobalCache();

  if (force) {
    cache.data = null;
    attributeKeyMapCache = null;
  }

  if (cache.data) {
    return cache.data;
  }

  if (cache.promise) {
    return cache.promise;
  }

  cache.promise = (async () => {
    try {
      const results: AttributeDefinition[] = [];
      let page = 1;
      let hasNext = false;

      do {
        const response = await ecommerceClientAttributesList(
          undefined,
          undefined,
          "sort_order",
          page
        );
        results.push(...(response.results ?? []));
        hasNext = Boolean(response.next);
        page += 1;
      } while (hasNext);

      cache.data = results;
      return results;
    } finally {
      cache.promise = null;
    }
  })();

  return cache.promise;
};

export const getAttributeKeyMap = async (): Promise<Map<number, AttributeDefinition>> => {
  if (attributeKeyMapCache) {
    return attributeKeyMapCache;
  }

  const attributes = await fetchAttributeDefinitions();
  attributeKeyMapCache = new Map();
  attributes.forEach((attribute) => attributeKeyMapCache!.set(attribute.id, attribute));
  return attributeKeyMapCache;
};

const buildFilterGroups = (attributes: AttributeDefinition[], language: Locale): FilterGroup[] => {
  return attributes
    .map((attribute) => {
      const attributeLooksLikeCategory = isCategoryAttribute(attribute);
      const title =
        getTextFromValue(attribute.name, language) ?? attribute.key ?? `Attribute ${attribute.id}`;
      const options = normalizeOptions(attribute, language);

      if (!options.length) {
        return null;
      }

      const hasCategoryOptions = options.some((option) => typeof option.categoryId === "number");
      const isCategoryGroup = attributeLooksLikeCategory && hasCategoryOptions;
      const effectiveOptions = isCategoryGroup
        ? options.filter((option) => typeof option.categoryId === "number")
        : options;

      if (!effectiveOptions.length) {
        return null;
      }

      return {
        id: attribute.id,
        key: attribute.key || `attribute-${attribute.id}`,
        title,
        isCategoryGroup,
        options: effectiveOptions,
      };
    })
    .filter(Boolean) as FilterGroup[];
};

export const useFilterAttributeGroups = (
  language: Locale = "ge"
): UseFilterAttributeGroupsResult => {
  const [groups, setGroups] = useState<FilterGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshGroups = useCallback(
    async (force = false) => {
      setLoading(true);
      setError(null);
      try {
        const attributes = await fetchAttributeDefinitions(force);
        setGroups(buildFilterGroups(attributes, language));
      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Failed to load filters");
        setGroups([]);
      } finally {
        setLoading(false);
      }
    },
    [language]
  );

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const attributes = await fetchAttributeDefinitions();
        if (!cancelled) {
          setGroups(buildFilterGroups(attributes, language));
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.response?.data?.message || err?.message || "Failed to load filters");
          setGroups([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [language]);

  const refetch = useCallback(async () => {
    await refreshGroups(true);
  }, [refreshGroups]);

  const memoizedGroups = useMemo(() => groups, [groups]);

  return {
    groups: memoizedGroups,
    loading,
    error,
    refetch,
  };
};
