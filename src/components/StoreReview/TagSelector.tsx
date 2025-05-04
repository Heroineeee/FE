import React from 'react';
import Tag from './Tag';
export interface TagSelectorProps {
  tags: string[];
  selectedTags: string[];
  onChange: (updated: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  tags,
  selectedTags,
  onChange,
}) => {
  const toggleTag = (tag: string) => {
    const isSelected = selectedTags.includes(tag);
    const updated = isSelected
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    onChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-[12px]">
      {tags.map((tag) => (
        <Tag
          key={tag}
          label={tag}
          selected={selectedTags.includes(tag)}
          onClick={() => toggleTag(tag)}
        />
      ))}
    </div>
  );
};

export default TagSelector;
