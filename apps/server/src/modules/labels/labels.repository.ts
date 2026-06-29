import { db } from "../../db";
import { CreateLabelInput, UpdateLabelInput } from "@vertexpm/validation";

export class LabelsRepository {
  async createLabel(data: CreateLabelInput) {
    return db.label.create({
      data,
    });
  }

  async findLabelById(id: string) {
    return db.label.findUnique({
      where: { id },
    });
  }

  async findWorkspaceLabels(workspaceId: string) {
    return db.label.findMany({
      where: { workspaceId },
      orderBy: { name: "asc" },
    });
  }

  async updateLabel(id: string, data: UpdateLabelInput) {
    return db.label.update({
      where: { id },
      data,
    });
  }

  async deleteLabel(id: string) {
    return db.label.delete({
      where: { id },
    });
  }

  async addLabelToWorkItem(workItemId: string, labelId: string) {
    return db.workItemLabel.create({
      data: {
        workItemId,
        labelId,
      },
    });
  }

  async removeLabelFromWorkItem(workItemId: string, labelId: string) {
    return db.workItemLabel.delete({
      where: {
        workItemId_labelId: {
          workItemId,
          labelId,
        },
      },
    });
  }

  async findWorkItemLabels(workItemId: string) {
    return db.workItemLabel.findMany({
      where: { workItemId },
      include: { label: true },
    });
  }
}
