export function RedemptionBanner() {
  return (
    <div className="flex sticky place-content-center gap-x-6 bg-error px-6 py-2.5 sm:px-3.5">
      <p className="text-sm leading-6 text-white text-center">
        <a href="#">
          On Sep 6, 2023 the DAO voted to dissolve and it is no longer
          operating. Read more here &nbsp;
          <span aria-hidden="true">&rarr;</span>
        </a>
      </p>
    </div>
  );
}
