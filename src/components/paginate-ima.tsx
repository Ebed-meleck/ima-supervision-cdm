/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactPaginate from "react-paginate";

interface Props {
  pagination: any;
  handlePageClick: (page: { selected: number }) => void;
}

export const ImaPagination: React.FC<Props> = ({ pagination, handlePageClick }) => {
  return (
    <div className="mt-4 mb-4 flex  justify-between">
      <div className="text-sm text-muted-foreground">
        Page {pagination.current} of {pagination.nb_page}
      </div>
      <ReactPaginate
        previousLabel={"←"}
        nextLabel={"→"}
        breakLabel={"..."}
        pageCount={pagination.nb_page}
        forcePage={pagination.nb_page - 1}
        marginPagesDisplayed={1}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName="flex justify-center sm:justify-end space-x-1 "
        pageClassName=""
        pageLinkClassName="px-3 py-1 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
        previousClassName=""
        previousLinkClassName="px-3 py-1 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
        nextClassName=""
        nextLinkClassName="px-3 py-1 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
        breakClassName=""
        breakLinkClassName="px-3 py-1 border border-gray-300 text-gray-500 bg-gray-50 rounded-md"
        activeClassName="!bg-primary text-white"
        activeLinkClassName="!bg-primary !text-white"
      />
    </div>
  );
};