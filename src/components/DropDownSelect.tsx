import React, { useState } from "react";
import DownArrowIcon from "./Icons/DownArrowIcon";

// Probably wont use this component due to accessibility issues
// and the fact that it is not a native select element. But keeping it for now.

const DropDownSelect = ({
  categories,
  onFieldChange,
}: {
  categories: string[];
  onFieldChange: Function;
}) => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown-container">
      <div className="dropdown-select" onClick={() => setIsOpen(!isOpen)}>
        {selectedCategory}

        {isOpen ? <DownArrowIcon /> : <DownArrowIcon />}
      </div>
      <div className={`dropdown-options ${isOpen ? "open" : ""}`}>
        <ul>
          {categories.map((category, index) => (
            <li
              key={index}
              onClick={() => {
                setSelectedCategory(category);
                onFieldChange(category);
                setIsOpen(!isOpen);
              }}
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropDownSelect;
