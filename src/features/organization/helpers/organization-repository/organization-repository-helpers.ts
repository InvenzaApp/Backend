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
            organizationsIdList: number[],
            user: User
        ): boolean;

        updateUser(
            organizationsIdList: number[],
            userId: number
        ): boolean;

        deleteUser(
            organizationId: number,
            userId: number
        ): boolean;
    }
}