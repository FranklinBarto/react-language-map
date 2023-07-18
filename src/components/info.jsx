import React from "react";

const InfoContainer = ({ title, data, dataType }) => {
  if (title && data) {
    if (dataType == "searchByLanguage") {
      return (
        <section className="infoSection">
          <span>{title}</span>
          <ul>
            {data &&
              Array.isArray(data) &&
              data.map((item) => <li>{item.country}</li>)}
          </ul>
        </section>
      );
    } else if (dataType == "searchByCountry") {
      return (
        <section className="infoSection">
          <span>{title}</span>
          <ul>
            {data && Array.isArray(data) && data.map((item) => <li>{item}</li>)}
          </ul>
        </section>
      );
    }
  }
  return "";
};

export default InfoContainer;
