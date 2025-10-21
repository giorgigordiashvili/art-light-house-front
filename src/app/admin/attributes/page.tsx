"use client";
import { useState, useEffect } from "react";
import AdminLayout from "@/components/NewAdmin/layout/AdminLayout";
import { Card, CardHeader, CardContent } from "@/components/NewAdmin/ui/Card";
import { Button, ButtonGroup } from "@/components/NewAdmin/ui/Button";
import { Input, Select } from "@/components/NewAdmin/ui/Form";
import AttributesTable from "@/components/NewAdmin/attributes/AttributesTable";
import AttributeForm from "@/components/NewAdmin/attributes/AttributeForm";
import AttributeValuesManager from "@/components/NewAdmin/attributes/AttributeValuesManager";
import styled from "styled-components";
import { AdminAttribute, AdminAttributeRequest } from "@/api/generated/interfaces";
import adminAxios from "@/api/admin-axios";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;

  h1 {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
  }
`;

const FilterSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px 200px auto;
  gap: 16px;
  align-items: end;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;

  .stat-value {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 8px 0;
    color: #007bff;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6c757d;
    font-weight: 500;
  }
`;

const Modal = styled.div<{ $isOpen: boolean }>`
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 24px;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;

  &:hover {
    color: #212529;
  }
`;

const TypeOverview = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const TypeCard = styled.div`
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 16px;
  text-align: center;

  .type-icon {
    width: 32px;
    height: 32px;
    margin: 0 auto 8px auto;
    background: #f8f9fa;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6c757d;
  }

  .type-name {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .type-count {
    color: #007bff;
    font-weight: 500;
    font-size: 0.875rem;
  }
`;

type ModalView = "form" | "values" | null;

const AttributesManagement = () => {
  const [attributes, setAttributes] = useState<AdminAttribute[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalView, setModalView] = useState<ModalView>(null);
  const [editingAttribute, setEditingAttribute] = useState<AdminAttribute | null>(null);
  const [managingValuesFor, setManagingValuesFor] = useState<AdminAttribute | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Fetch attributes on component mount
  useEffect(() => {
    loadAttributes();
  }, []);

  const loadAttributes = async () => {
    try {
      setLoading(true);
      const response = await adminAxios.get("/api/products/admin/attributes/");
      setAttributes(response.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAttribute = () => {
    setEditingAttribute(null);
    setModalView("form");
  };

  const handleEditAttribute = (attribute: AdminAttribute) => {
    setEditingAttribute(attribute);
    setModalView("form");
  };

  const handleManageValues = (attribute: AdminAttribute) => {
    setManagingValuesFor(attribute);
    setModalView("values");
  };

  const handleDeleteAttribute = async (attribute: AdminAttribute) => {
    if (confirm(`Are you sure you want to delete "${attribute.name}"?`)) {
      try {
        setLoading(true);
        await adminAxios.delete(`/api/products/admin/attributes/${attribute.id}/delete/`);
        await loadAttributes();
      } catch {
        alert("Failed to delete attribute. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleReorderAttributes = (reorderedAttributes: AdminAttribute[]) => {
    setAttributes(reorderedAttributes);
  };

  const handleFormSubmit = async (formData: any) => {
    try {
      setLoading(true);

      // Prepare API data
      const attributeData: AdminAttributeRequest = {
        name: formData.name,
        attribute_type: formData.attribute_type,
        is_required: formData.is_required ?? false,
        is_filterable: formData.is_filterable ?? false,
        parent: formData.parent || undefined,
        categories: formData.categories || [],
      };

      if (editingAttribute) {
        await adminAxios.patch(
          `/api/products/admin/attributes/${editingAttribute.id}/update/`,
          attributeData
        );
      } else {
        await adminAxios.post("/api/products/admin/attributes/create/", attributeData);
      }

      // Reload attributes after successful create/update
      await loadAttributes();

      setModalView(null);
      setEditingAttribute(null);
    } catch {
      alert("Failed to save attribute. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleValuesSubmit = async () => {
    if (!managingValuesFor) return;

    try {
      setLoading(true);

      // Note: This would need to be implemented based on the specific API
      // for now just reload the attributes
      await loadAttributes();

      setModalView(null);
      setManagingValuesFor(null);
    } catch {
      alert("Failed to update attribute values. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalView(null);
    setEditingAttribute(null);
    setManagingValuesFor(null);
  };

  const filteredAttributes = attributes.filter((attribute) => {
    const matchesSearch = attribute.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || (attribute.attribute_type as any) === typeFilter;
    return matchesSearch && matchesType;
  });

  const stats = {
    total: attributes.length,
    required: attributes.filter((a) => a.is_required).length,
    filterable: attributes.filter((a) => a.is_filterable).length,
    withValues: attributes.filter((a) => a.values && a.values.length > 0).length,
  };

  const typeStats = {
    text: attributes.filter((a) => (a.attribute_type as any) === "text").length,
    number: attributes.filter((a) => (a.attribute_type as any) === "number").length,
    boolean: attributes.filter((a) => (a.attribute_type as any) === "boolean").length,
    choice: attributes.filter((a) => (a.attribute_type as any) === "choice").length,
    color: attributes.filter((a) => (a.attribute_type as any) === "color").length,
    size: attributes.filter((a) => (a.attribute_type as any) === "size").length,
  };

  return (
    <AdminLayout>
      <PageHeader>
        <div>
          <h1>Attributes</h1>
          <p>Define product characteristics and enable filtering options</p>
        </div>
        <Button onClick={handleCreateAttribute}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
          Add Attribute
        </Button>
      </PageHeader>

      <StatsRow>
        <StatCard>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Attributes</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.required}</div>
          <div className="stat-label">Required</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.filterable}</div>
          <div className="stat-label">Filterable</div>
        </StatCard>
        <StatCard>
          <div className="stat-value">{stats.withValues}</div>
          <div className="stat-label">With Values</div>
        </StatCard>
      </StatsRow>

      <Card>
        <CardHeader>
          <h2>Attribute Types</h2>
        </CardHeader>
        <CardContent>
          <TypeOverview>
            <TypeCard>
              <div className="type-icon">T</div>
              <div className="type-name">Text</div>
              <div className="type-count">{typeStats.text} attributes</div>
            </TypeCard>
            <TypeCard>
              <div className="type-icon">#</div>
              <div className="type-name">Number</div>
              <div className="type-count">{typeStats.number} attributes</div>
            </TypeCard>
            <TypeCard>
              <div className="type-icon">✓</div>
              <div className="type-name">Boolean</div>
              <div className="type-count">{typeStats.boolean} attributes</div>
            </TypeCard>
            <TypeCard>
              <div className="type-icon">⋯</div>
              <div className="type-name">Choice</div>
              <div className="type-count">{typeStats.choice} attributes</div>
            </TypeCard>
            <TypeCard>
              <div className="type-icon">●</div>
              <div className="type-name">Color</div>
              <div className="type-count">{typeStats.color} attributes</div>
            </TypeCard>
            <TypeCard>
              <div className="type-icon">⊞</div>
              <div className="type-name">Size</div>
              <div className="type-count">{typeStats.size} attributes</div>
            </TypeCard>
          </TypeOverview>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <FilterSection>
            <div>
              <Input
                type="search"
                placeholder="Search attributes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="all">All Types</option>
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="boolean">Boolean</option>
                <option value="choice">Choice</option>
                <option value="color">Color</option>
                <option value="size">Size</option>
              </Select>
            </div>
            <div>
              <Select>
                <option>All Status</option>
                <option>Required</option>
                <option>Optional</option>
              </Select>
            </div>
            <div>
              <ButtonGroup>
                <Button $variant="secondary" $size="sm">
                  Export
                </Button>
                <Button $variant="secondary" $size="sm">
                  Import
                </Button>
              </ButtonGroup>
            </div>
          </FilterSection>

          <AttributesTable
            attributes={filteredAttributes}
            loading={loading}
            onEdit={handleEditAttribute}
            onDelete={handleDeleteAttribute}
            onManageValues={handleManageValues}
            onReorder={handleReorderAttributes}
          />
        </CardContent>
      </Card>

      <Modal $isOpen={modalView !== null}>
        <ModalContent>
          <ModalHeader>
            <h2>
              {modalView === "form"
                ? editingAttribute
                  ? "Edit Attribute"
                  : "Create New Attribute"
                : modalView === "values"
                  ? "Manage Values"
                  : ""}
            </h2>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
          </ModalHeader>

          {modalView === "form" && (
            <AttributeForm
              initialData={editingAttribute}
              onSubmit={handleFormSubmit}
              onCancel={handleCloseModal}
              loading={loading}
            />
          )}

          {modalView === "values" && managingValuesFor && (
            <AttributeValuesManager
              attribute={managingValuesFor}
              onSave={handleValuesSubmit}
              onCancel={handleCloseModal}
              loading={loading}
            />
          )}
        </ModalContent>
      </Modal>
    </AdminLayout>
  );
};

export default AttributesManagement;
