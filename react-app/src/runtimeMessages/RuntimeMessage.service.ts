import { RuntimeMessageRepo } from "./RuntimeMessage.repo";

export class RuntimeMessageService {
  constructor(private repo: RuntimeMessageRepo) {}

  public sendMessage = this.repo.sendMessage;
}
