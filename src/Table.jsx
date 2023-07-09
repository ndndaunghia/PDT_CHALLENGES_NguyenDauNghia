import React, { useContext, useState } from "react";
import { TableContext } from "./TableContext";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { Button } from "@mui/material";
export default function Table() {
  const {
    movieData,
    sortColumn,
    sortOrder,
    currentPage,
    query,
    movieQuery,
    visibleColumns,
    toggleColumn,
    dragColumn,
    averagePopularity,
    handleDragOver,
    handleDragStart,
    handleDrop,
    onChangeSearchData,
    handleSearch,
    handleSort,
    handleBack,
    handleNext,
    handlePageClick,
  } = useContext(TableContext);


  const sortedData = [...(query ? movieQuery : movieData)].sort((a, b) => {
    if (sortColumn) {
      const columnA = a[sortColumn];
      const columnB = b[sortColumn];

      if (
        sortColumn === "id" ||
        sortColumn === "popularity" ||
        sortColumn === "vote_average"
      ) {
        return sortOrder === "asc" ? columnA - columnB : columnB - columnA;
      }

      if (sortOrder === "asc") {
        return columnA.localeCompare(columnB);
      } else {
        return columnB.localeCompare(columnA);
      }
    } else {
      return 0;
    }
  });

  return (
    <div className="table-responsive">
      <h2 className="text-center my-3">Movie Data</h2>
      <div className="search-container d-flex justify-content-end pb-3">
        <div className="dropdown me-3">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa-solid fa-bars"></i>
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            {visibleColumns.map((item) => (
              <li key={item.column} className="dropdown-item">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleColumn(item.column)}
                />
                <label className="mx-2">{item.column}</label>
              </li>
            ))}
          </ul>
        </div>
       
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button"
          table="table-to-xls"
          filename="moviedata"
          sheet="tablexls"
          buttonText={<i className="fa-solid fa-file-csv"></i>}
        />
        <form action="" className="mx-4" onSubmit={(e) => handleSearch(e)}>
          <input
            type="text"
            name="searchData"
            id="searchData"
            value={query}
            onChange={onChangeSearchData}
          />
          <label htmlFor="searchData" className="ms-3">
            Search
          </label>
        </form>
      </div>
      <table className="table table-hover pt-3" id="table-to-xls">
        {sortedData.length !== 0 ? (
          <>
            <thead>
              <tr>
                {visibleColumns.map((item, index) => {
                  const { column, checked } = item;
                  if (!checked) {
                    return null;
                  }

                  return (
                    <th
                      key={column}
                      scope="col"
                      onClick={() => handleSort(column)}
                      draggable={!dragColumn}
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, index)}
                    >
                      {column.charAt(0).toUpperCase() + column.slice(1)}
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {sortedData.map((data) => (
                <tr key={data.id}>
                  {visibleColumns
                    .filter((item) => item.checked === true)
                    .map((item) => (
                      <td key={`${data.id}-${item.column}`}>
                        {data[item.column]}
                      </td>
                    ))}
                </tr>
              ))}
            </tbody>
          </>
        ) : (
          <tbody>
            <tr>
              <td>
                <h2 className="text-center">No data</h2>
              </td>
            </tr>
          </tbody>
        )}
      </table>
      <div className="d-flex justify-content-center align-items-center my-5">
        <div
          className="d-flex justify-content-around align-items-center"
          style={{ width: "440px" }}
        >
          <Button variant="contained" onClick={handleBack}>
            Prev
          </Button>

          <button
            type="button"
            className={currentPage === 1 ? "active" : "default-btn"}
            onClick={() => handlePageClick(1)}
          >
            1
          </button>
          <button
            type="button"
            className={currentPage === 2 ? "active" : "default-btn"}
            onClick={() => handlePageClick(2)}
          >
            2
          </button>
          <button
            type="button"
            className={currentPage === 3 ? "active" : "default-btn"}
            onClick={() => handlePageClick(3)}
          >
            3
          </button>
          <button
            type="button"
            className={currentPage === 4 ? "active" : "default-btn"}
            onClick={() => handlePageClick(4)}
          >
            4
          </button>
          <button
            type="button"
            className={currentPage === 5 ? "active" : "default-btn"}
            onClick={() => handlePageClick(5)}
          >
            5
          </button>

          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
