import constants from "@constants";
import type { TagType } from "@types";

export interface TagInfo {
  name: string;
  rootPath: string;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
}

export const getTagInfoForType = (
  tagType: TagType | string | undefined,
): TagInfo | null => {
  if (!tagType) {
    return null;
  }
  return constants.TAG_INFO[tagType as TagType] || null;
};
