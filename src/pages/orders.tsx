import { useEffect, useState, type ReactElement } from "react";
import TableHOC from "../components/admin/TableHOC"
import type { Column } from "react-table";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMyOrdersQuery } from "../redux/api/orderAPI";
import type { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/loader";
import type { RootState } from "../redux/store";

type DataType = {
    _id: string;
    amount: number;
    quantity: number;
    discount: number;
    status: ReactElement;
    action: ReactElement;
}
const column: Column<DataType>[] = [
    {
        Header: "ID",
        accessor: "_id",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Quantity",
        accessor: "quantity",
    },
    {
        Header: "Discount",
        accessor: "discount",
    },
    {
        Header: "Status",
        accessor: "status",
    },
    {
        Header: "Action",
        accessor: "action",
    },
]

const Orders = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const { isLoading, isError, error, data } = useMyOrdersQuery(user?._id!);

    const [rows, setRows] = useState<DataType[]>([])
    const Table = TableHOC<DataType>(column, rows, "dashboard-product-box", "Orders", rows.length > 6)();

    if (isError) {
        const err = error as CustomError;
        toast.error(err.data.message);
    }

    useEffect(() => {
        if (data)
            setRows(
                data.orders.map((i) => ({
                    _id: i._id,
                    amount: i.total,
                    discount: i.discount,
                    quantity: i.orderItems.length,
                    status: (
                        <span
                            className={
                                i.status === "Processing"
                                    ? "red"
                                    : i.status === "Shipped"
                                        ? "green"
                                        : "purple"
                            }
                        >
                            {i.status}
                        </span>
                    ),
                    action: <Link to={`/admin/transaction/${i._id}`}>Manage</Link>,
                }))
            );
    }, [data]);

    return (
        <div className="container" >
            <h1>My Orders</h1>
            {isLoading ? <Skeleton length={20} /> : Table}
        </div>
    )
}

export default Orders
