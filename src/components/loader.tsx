
const Loader = () => {
    return (
        <section className="loader">
            <div></div>
        </section>
    )
}

export default Loader

interface SkeletonProps {
    width?: string;
    length?: number;
    height?: string;
    containerHeight?: string;
}

export const Skeleton = ({
    width = "unset",
    length = 3,
    height = "30px",
    containerHeight = "unset",
}: SkeletonProps) => {
    const skeletions = Array.from({ length }, (_, idx) => (
        <div key={idx} className="skeleton-shape" style={{ height }}></div>
    ));

    return (
        <div className="skeleton-loader" style={{ width, height: containerHeight }}>
            {skeletions}
        </div>
    );
};
