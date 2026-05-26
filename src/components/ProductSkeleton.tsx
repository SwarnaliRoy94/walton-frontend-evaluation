const ProductSkeleton = () => {
  return (
    <div className="bg-linear-to-b from-white via-white to-[#faf7ff] rounded-3xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="aspect-square bg-linear-to-b from-[#f5f1ff] via-[#f7f5ff] to-[#edf1ff]" />
      <div className="p-5 flex flex-col gap-3">
        <div className="h-3 bg-slate-100 rounded-full w-4/5" />
        <div className="h-3 bg-slate-100 rounded-full w-3/5" />
        <div className="h-4 bg-slate-100 rounded-full w-2/5 mt-1" />
        <div className="h-10 bg-slate-100 rounded-2xl mt-1" />
      </div>
    </div>
  );
};

export default ProductSkeleton;
