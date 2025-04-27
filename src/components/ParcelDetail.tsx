import React from "react";

const ParcelDetail = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactElement;
  title: string;
  value: string | number;
}) => {
  return (
    <li>
      {icon}
      <div className="parcel-detail">
        {title ? <h3>{title}</h3> : null}
        <p>{value}</p>
      </div>
    </li>
  );
};

export default ParcelDetail;
