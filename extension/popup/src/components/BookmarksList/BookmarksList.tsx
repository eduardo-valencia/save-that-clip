import ResourceList from "../ResourceList";
import { Bookmark } from "../../bookmarks/Bookmarks.repo-abstraction";
import BookmarkItem from "./BookmarkItem";

interface Props {
  bookmarks: Bookmark[];
}

export default function BookmarkList({ bookmarks }: Props) {
  const renderBookmark = (bookmark: Bookmark): JSX.Element => {
    return <BookmarkItem bookmark={bookmark} key={bookmark.id} />;
  };

  const renderedItems: JSX.Element[] = bookmarks.map(renderBookmark);

  return <ResourceList>{renderedItems}</ResourceList>;
}
