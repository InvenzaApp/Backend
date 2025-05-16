import FileManager from "../../../../../managers/file-manager";
import { User } from "../../../../user/models/user";
import { Organization } from "../../../models/organization";
import { OrganizationJson } from "../../../models/organization-json";
import { OrganizationRepository } from "../../../repository/organization-repository";

const file = new FileManager("database", "organization");

OrganizationRepository.prototype.getOrganizationAdmin = function (
    organizationId: number
): User | null {
    const jsonData: OrganizationJson[] = file.getFileAsJson();

    const organizationJson: OrganizationJson | undefined = jsonData.find((item) => item.id === organizationId);

    if (!organizationJson) return null;

    const organization: Organization | null = Organization.fromJson(organizationJson);

    if (!organization) return null;

    return organization.admin;
}