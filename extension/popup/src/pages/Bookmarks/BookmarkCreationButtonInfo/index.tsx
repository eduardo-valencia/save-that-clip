import React, { useEffect, useState } from "react";
import DisabledReason from "./DisabledReason";
import BookmarkCreationButton from "./BookmarkCreationButton";
import { EpisodeService, PossibleTab } from "../../../episodes/Episode.service";

export type IsButtonDisabled = boolean;

export default function BookmarkCreationButtonInfo() {
  const [isDisabled, setIsDisabled] = useState<IsButtonDisabled>(false);

  const setIsDisabledIfNoEpisodeTab = async (): Promise<void> => {
    const episodeService = new EpisodeService();
    const tab: PossibleTab = await episodeService.findOneEpisodeTab();
    setIsDisabled(!tab);
  };

  useEffect(() => {
    const handleTabChange = (): void => {
      void setIsDisabledIfNoEpisodeTab();
    };

    /**
     * We must do this because the popup will only work if it's open in the
     * Netflix tab.
     */
    const listenForChangesToTab = (): void => {
      chrome.tabs.onUpdated.addListener(handleTabChange);
      chrome.tabs.onReplaced.addListener(handleTabChange);
    };

    void setIsDisabledIfNoEpisodeTab();
    listenForChangesToTab();
  }, []);

  return (
    <div>
      {isDisabled ? <DisabledReason /> : null}
      <BookmarkCreationButton disabled={isDisabled} />
    </div>
  );
}
