const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-slate-100" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 bg-slate-100 rounded-full w-3/4" />
        <div className="h-3 bg-slate-100 rounded-full w-1/2" />
        <div className="h-4 bg-slate-100 rounded-full w-1/3 mt-1" />
        <div className="h-10 bg-slate-100 rounded-xl mt-1" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
