import url from "@/config/urls";

interface StyleInfoFormShowProps {
  data: any;
}

const StyleInfoFormShow = ({ data }: StyleInfoFormShowProps) => {
  console.log(data)
  const styleFields = data?.styleRows || data?.styleJson || null;
  const hasStyleFields = (() => {
    if (!styleFields) return false;
    // If it's an array, treat non-empty as present
    if (Array.isArray(styleFields)) return styleFields.length > 0;
    // If it has a `rows` array (our frontend shape), check length
    if (Array.isArray(styleFields.rows)) return styleFields.rows.length > 0;
    // Otherwise check for any own keys with truthy values
    return Object.keys(styleFields).length > 0;
  })();
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <tbody>
            
            <tr>
              <td className="border p-2 font-medium bg-muted/30 w-20">Style</td>
              <td className="border p-2 uppercase">{data?.style ?? ""}</td>
              <td className="border p-2 font-medium bg-muted/30 w-20">Buyer</td>
              <td className="border p-2">{data?.buyer ?? ""}</td>
              <td className="border p-2 font-medium bg-muted/30">Brand</td>
              <td className="border p-2">{data?.brand ?? ""}</td>
              <td className="border p-2 items-center justify-center" rowSpan={4}>
                {data?.image ? (
                  <img
                    src={`${url.BASE_URL}${encodeURI(data.image)}`}
                    alt="Style"
                    className="h-36 w-36 object-contain"
                  />
                ) : (
                  "N/A"
                )}
              </td>
            </tr>
            <tr>
              <td className="border p-2 font-medium bg-muted/30">Group</td>
              <td className="border p-2">{data?.group ?? ""}</td>
              <td className="border p-2 font-medium bg-muted/30">Merchandiser</td>
              <td className="border p-2 capitalize">{data?.name ?? ""}</td>
              <td className="border p-2 font-medium bg-muted/30">Item</td>
              <td className="border p-2">{data?.item ?? ""}</td>
            </tr>
            <tr>
              <td className="border p-2 font-medium bg-muted/30">GSM</td>
              <td className="border p-2">{data?.gsm ?? ""}</td>
              <td className="border p-2 font-medium bg-muted/30">Size</td>
              <td className="border p-2">{data?.size ?? ""}</td>
              <td className="border p-2 font-medium bg-muted/30">Fabric Type</td>
              <td className="border p-2">{data?.fabricType ?? ""}</td>
            </tr>
            <tr>              
              <td className="border p-2 font-medium bg-muted/30">Color</td>
              <td className="border p-2">{data?.color ?? ""}</td>
              <td className="border p-2 font-medium bg-muted/30">Quantity</td>
              <td className="border p-2">
                {data?.quantity ?? data?.qty ?? ""}
              </td>
              <td className="border p-2 font-medium bg-muted/30"></td>
              <td className="border p-2 font-medium bg-muted/30"></td>
            </tr>
            {hasStyleFields && (
              <>
                {(() => {
                  const rows = Array.isArray(styleFields?.rows)
                    ? styleFields.rows
                    : Array.isArray(styleFields)
                    ? styleFields
                    : null;

                  if (rows && rows.length > 0) {
                    return rows.map((r: any, i: number) => (
                      <tr key={`sr-${i}`}>
                        <td className="border p-2 align-top  bg-muted/30 font-medium w-1/3">{r.key ?? r.label ?? `Field ${i + 1}`}</td>
                        <td className="border p-2">{r.value ?? r.val ?? JSON.stringify(r)}</td>
                      </tr>
                    ));
                  }

                  if (styleFields && typeof styleFields === "object") {
                    const entries = Object.entries(styleFields).filter(([k]) => k !== "rows");
                    if (entries.length > 0) {
                      return entries.map(([k, v], i) => (
                        <tr key={`se-${i}`}>
                          <td className="border p-2 align-top font-medium w-1/3">{k}</td>
                          <td className="border p-2">{typeof v === "object" ? JSON.stringify(v) : String(v)}</td>
                        </tr>
                      ));
                    }
                  }

                  return (
                    <tr>
                      <td className="border p-2 align-top font-medium w-1/3">Style Fields</td>
                      <td className="border p-2"><pre className="whitespace-pre-wrap">{JSON.stringify(styleFields)}</pre></td>
                    </tr>
                  );
                })()}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StyleInfoFormShow;
