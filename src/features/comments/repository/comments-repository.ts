import { CockpitRepository } from "../../../core/repository/cockpit-repository";
import { UpdatePayload } from "../../../core/repository/models/payload/update-payload";
import { DateTime } from "../../../helpers/date-time";
import FileManager from "../../../managers/file-manager";
import { TaskJson } from "../../task/models/task-json";
import { TaskComment } from "../models/comment";
import { CommentsCreatePayload } from "../payload/comments-create-payload";
import IdGetter from "../../../helpers/id-getter";

export class CommentsRepository extends CockpitRepository<TaskComment> {
    private file: FileManager;

    constructor() {
        super();
        this.file = new FileManager("database", "tasks");
    }

    add(payload: CommentsCreatePayload): TaskComment | null {
        const jsonData: TaskJson[] = this.file.getFileAsJson();
        const taskJson: TaskJson | undefined = jsonData.find((item) => item.id === payload.id);

        if (!taskJson) return null;

        const taskCommentId: number = IdGetter(taskJson.comments);

        const comment = new TaskComment({
            id: taskCommentId,
            userId: payload.userId,
            title: payload.title,
            publishDate: DateTime.getFullTimestamp(),
            deleted: false,
            author: null,
        });

        taskJson.comments.push(comment.toJson());

        this.file.saveJsonAsFile(jsonData);

        return comment;
    }

    get(resourceId: number): TaskComment | null {
        throw new Error("Method not implemented.");
    }

    getAll(resourceId: number): TaskComment[] | null {
        const jsonData: TaskJson[] = this.file.getFileAsJson();

        const taskJson: TaskJson | undefined = jsonData.find((item: any) => item.id === resourceId);

        if (!taskJson) return null;

        const commentsList: TaskComment[] = taskJson.comments.flatMap((item) => {
            const comment: TaskComment | null = TaskComment.fromJson(item);

            if (!comment) return [];

            return comment;
        });

        return commentsList;
    }

    update(payload: UpdatePayload): number | null {
        throw new Error("Method not implemented.");
    }

    delete(resourceId: number): boolean {
        const jsonData: TaskJson[] = this.file.getFileAsJson();
        const taskJson: TaskJson | undefined = jsonData.find((item) => {
            return item.comments.some((commentItem) => {
                return commentItem.id == resourceId;
            })
        });

        if (!taskJson) return false;

        const comment = taskJson.comments.find((item: any) => item.id === resourceId);

        if (!comment) return false;

        comment.deleted = true;

        this.file.saveJsonAsFile(jsonData);

        return true;
    }

}
