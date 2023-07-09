import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { APIKEY, BASEURL, SEARCH_QUERY } from "./API";

export const TableContext = createContext({});

export const TableProvider = ({ children }) => {
  const [movieData, setMovieData] = useState([]);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const [movieQuery, setMovieQuery] = useState([]);
  const [visibleColumns, setVisibleColumns] = useState([
    { column: "id", checked: true },
    { column: "title", checked: true },
    { column: "overview", checked: true },
    { column: "popularity", checked: true },
    { column: "release_date", checked: true },
    { column: "vote_average", checked: true },
  ]);
  const [dragColumn, setDragColumn] = useState(null);

  const toggleColumn = (column) => {
    const updatedColumns = visibleColumns.map((item) =>
      item.column === column ? { ...item, checked: !item.checked } : item
    );
    setVisibleColumns(updatedColumns);
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index);
    setDragColumn(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, index) => {
    e.preventDefault();
    const droppedColumnIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const updatedColumns = [...visibleColumns];
    const draggedColumn = updatedColumns.splice(droppedColumnIndex, 1)[0];
    updatedColumns.splice(index, 0, draggedColumn);
    setVisibleColumns(updatedColumns);
    setDragColumn(null);
  };

  const APIURL = BASEURL + currentPage + APIKEY;

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBack = () => {
    if (currentPage === 1) return;
    else setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage === 5) return;
    else setCurrentPage(currentPage + 1);
  };

  const onChangeSearchData = (e) => {
    setQuery(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const QUERY = SEARCH_QUERY + `&query=${query}` + `&page=${currentPage}`;

    axios
      .get(QUERY)
      .then((res) => {
        setMovieQuery(res.data.results);
      })
      .catch((error) => {
        console.log(error);
      });
    // console.log(QUERY);
  };

  useEffect(() => {
    if (query.trim() !== "") {
      const QUERY = SEARCH_QUERY + `&query=${query}` + `&page=${currentPage}`;
      axios
        .get(QUERY)
        .then((res) => {
          setMovieQuery(res.data.results);
          console.log(res.data.results);
        })
        .catch((error) => {
          console.log(error);
        });
      console.log(QUERY);
    } else {
      axios
        .get(APIURL)
        .then((res) => {
          setMovieData(res.data.results);
          setMovieQuery([]);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [currentPage, query]);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  return (
    <TableContext.Provider
      value={{
        movieData,
        sortColumn,
        sortOrder,
        currentPage,
        query,
        movieQuery,
        visibleColumns,
        dragColumn,
        handleDragOver,
        handleDragStart,
        handleDrop,
        toggleColumn,
        handleSort,
        handlePageClick,
        handleBack,
        handleNext,
        onChangeSearchData,
        handleSearch,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};
