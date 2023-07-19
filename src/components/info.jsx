import React from "react";

const InfoContainer = ({ title, data, dataType }) => {

  // Ensure title and data to be displayed in the info section holds data
  if (title && data) {
    // Return jsx according to origin context
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
