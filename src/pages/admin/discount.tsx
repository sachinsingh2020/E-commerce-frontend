import { useFetchData } from "6pp";
import { type ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { type Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { Skeleton } from "../../components/loader";
import { type RootState, server } from "../../redux/store";
import type { AllDiscountResponse } from "../../types/api-types";

interface DataType {
    code: string;
    amount: number;
    _id: string;
    action: ReactElement;
}

const columns: Column<DataType>[] = [
    {
        Header: "Id",
        accessor: "_id",
    },

    {
        Header: "Code",
        accessor: "code",
    },
    {
        Header: "Amount",
        accessor: "amount",
    },
    {
        Header: "Action",
        accessor: "action",
    },
];

const Discount = () => {
    const { user } = useSelector((state: RootState) => state.userReducer);

    const {
        data,
        loading: isLoading,
        error,
    } = useFetchData<AllDiscountResponse>(
        `${server}/api/v1/payment/coupon/all?id=${user?._id}`,
        "discount-codes"
    );

    const [rows, setRows] = useState<DataType[]>([]);

    const Table = TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Discount Coupons",
        rows.length > 6
    )();

    if (error) toast.error(error);

    useEffect(() => {
        if (data)
            setRows(
                data.coupons.map((i) => ({
                    _id: i._id,
                    code: i.code,
                    amount: i.amount,
                    action: <Link to={`/admin/discount/${i._id}`}>Manage</Link>,
                }))
            );
    }, [data]);

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
            <Link to="/admin/discount/new" className="create-product-btn">
                <FaPlus />
            </Link>
        </div>
    );
};

export default Discount;
