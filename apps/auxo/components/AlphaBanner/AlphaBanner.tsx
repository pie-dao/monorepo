export const AlphaBanner: React.FC = () => {
  return (
    <section className="w-full mb-6 flex">
      <div className="flex flex-col p-[2px] bg-gradient-to-r from-secondary via-secondary to-[#0BDD91] rounded-lg w-full">
        <div className="bg-gradient-to-r from-white via-white to-background p-2.5 rounded-md">
          <div className="flex items-center gap-x-2">
            <h3 className="text-primary text-sm font-medium flex gap-x-2 items-center">
              This page is currently in the alpha stage of development. As a
              result, the data provided may be subject to inaccuracies or
              inconsistencies. We advise exercising caution and verifying
              information from reliable sources.
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};
