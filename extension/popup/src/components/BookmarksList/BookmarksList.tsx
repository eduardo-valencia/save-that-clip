import ResourceList from "../ResourceList";
import { Bookmark } from "../../bookmarks/Bookmarks.repo-abstraction";
import BookmarkItem, { BookmarkItemProps } from "./BookmarkItem/BookmarkItem";

export interface BookmarkListProps
  extends Pick<BookmarkItemProps, "showEpisode"> {
  bookmarks: Bookmark[];
}

export default function BookmarkList({
  bookmarks,
  showEpisode,
}: BookmarkListProps) {
  const renderBookmark = (bookmark: Bookmark): JSX.Element => {
    return (
      <BookmarkItem
        bookmark={bookmark}
        key={bookmark.id}
        showEpisode={showEpisode}
      />
    );
  };

  const renderedItems: JSX.Element[] = bookmarks.map(renderBookmark);

  return <ResourceList>{renderedItems}</ResourceList>;
}
