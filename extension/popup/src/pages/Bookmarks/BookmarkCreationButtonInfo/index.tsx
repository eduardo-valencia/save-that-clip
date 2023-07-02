import React, { useEffect, useState } from "react";
import DisabledReason from "./DisabledReason";
import BookmarkCreationButton from "./BookmarkCreationButton";
import { EpisodeService, PossibleTab } from "../../../episodes/Episode.service";

export type IsButtonDisabled = boolean;

export default function BookmarkCreationButtonInfo() {
  const [isDisabled, setIsDisabled] = useState<IsButtonDisabled>(false);

  useEffect(() => {
    const setDefaultIsDisabled = async (): Promise<void> => {
      const episodeService = new EpisodeService();
      const tab: PossibleTab = await episodeService.findOneEpisodeTab();
      setIsDisabled(!tab);
    };

    void setDefaultIsDisabled();
  }, []);

  return (
    <div>
      {isDisabled ? <DisabledReason /> : null}
      <BookmarkCreationButton disabled={isDisabled} />
    </div>
  );
}
