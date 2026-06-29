import { LabelsRepository } from "./labels.repository";
import { CreateLabelInput, UpdateLabelInput } from "@vertexpm/validation";
import { WorkspacesRepository } from "../workspaces/workspaces.repository";

const repository = new LabelsRepository();
const workspacesRepository = new WorkspacesRepository();

export class LabelsService {
  private async checkWorkspaceAccess(workspaceId: string, userId: string) {
    const member = await workspacesRepository.findWorkspaceMember(workspaceId, userId);
    if (!member) {
      throw new Error("Unauthorized");
    }
    return member;
  }

  async createLabel(data: CreateLabelInput, userId: string) {
    await this.checkWorkspaceAccess(data.workspaceId, userId);
    return repository.createLabel(data);
  }

  async getWorkspaceLabels(workspaceId: string, userId: string) {
    await this.checkWorkspaceAccess(workspaceId, userId);
    return repository.findWorkspaceLabels(workspaceId);
  }

  async updateLabel(id: string, data: UpdateLabelInput, userId: string) {
    const label = await repository.findLabelById(id);
    if (!label) throw new Error("Not found");
    await this.checkWorkspaceAccess(label.workspaceId, userId);
    return repository.updateLabel(id, data);
  }

  async deleteLabel(id: string, userId: string) {
    const label = await repository.findLabelById(id);
    if (!label) throw new Error("Not found");
    await this.checkWorkspaceAccess(label.workspaceId, userId);
    return repository.deleteLabel(id);
  }

  async addLabelToWorkItem(workItemId: string, labelId: string, userId: string) {
    const label = await repository.findLabelById(labelId);
    if (!label) throw new Error("Label not found");
    await this.checkWorkspaceAccess(label.workspaceId, userId);
    return repository.addLabelToWorkItem(workItemId, labelId);
  }

  async removeLabelFromWorkItem(workItemId: string, labelId: string, userId: string) {
    const label = await repository.findLabelById(labelId);
    if (!label) throw new Error("Label not found");
    await this.checkWorkspaceAccess(label.workspaceId, userId);
    return repository.removeLabelFromWorkItem(workItemId, labelId);
  }

  async getWorkItemLabels(workItemId: string) {
    return repository.findWorkItemLabels(workItemId);
  }
}
