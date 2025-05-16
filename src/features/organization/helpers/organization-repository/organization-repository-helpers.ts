import { User } from "../../../user/models/user";
import { Organization } from "../../models/organization";
import { OrganizationRepository } from "../../repository/organization-repository";

declare module "../../repository/organization-repository" {
    interface OrganizationRepository {
        getOrganizationAdmin(
            organizationId: number
        ): User | null;

        getOrganizationByUserId(
            userId: number
        ): Organization | null;

        addUser(
            organizationId: number,
            user: User
        ): boolean;

        deleteUser(
            organizationId: number,
            userId: number
        ): boolean;
    }
}