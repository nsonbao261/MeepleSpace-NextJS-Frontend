import type { Address } from "@/types/checkout";

interface MapPlaceholderProps {
  address: Address | null;
}

export function MapPlaceholder({ address }: MapPlaceholderProps) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border bg-muted/40">
      <div className="flex h-full flex-col justify-between p-4 sm:p-5">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Delivery location</p>
          {address ? (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{address.recipientName}</p>
              <p>{address.line1}</p>
              <p>
                {address.ward}, {address.district}, {address.province}
              </p>
              <p>{address.phone}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select an address to preview delivery.</p>
          )}
        </div>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Map coming soon
        </p>
      </div>
    </div>
  );
}
