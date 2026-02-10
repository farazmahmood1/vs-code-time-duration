import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface Location {
  lat: number;
  lng: number;
  address?: string | null;
}

interface LocationMapDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  checkInLocation?: Location | null;
  checkOutLocation?: Location | null;
  employeeName: string;
}

export function LocationMapDialog({
  open,
  onOpenChange,
  checkInLocation,
  checkOutLocation,
  employeeName,
}: LocationMapDialogProps) {
  const center = checkInLocation
    ? ([checkInLocation.lat, checkInLocation.lng] as [number, number])
    : checkOutLocation
      ? ([checkOutLocation.lat, checkOutLocation.lng] as [number, number])
      : ([0, 0] as [number, number]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{employeeName} — Location</DialogTitle>
        </DialogHeader>
        <div className="h-[400px] rounded-lg overflow-hidden">
          <MapContainer
            center={center}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {checkInLocation && (
              <Marker
                position={[checkInLocation.lat, checkInLocation.lng]}
              >
                <Popup>
                  <strong>Check-in</strong>
                  {checkInLocation.address && <br />}
                  {checkInLocation.address}
                </Popup>
              </Marker>
            )}
            {checkOutLocation && (
              <Marker
                position={[checkOutLocation.lat, checkOutLocation.lng]}
              >
                <Popup>
                  <strong>Check-out</strong>
                  {checkOutLocation.address && <br />}
                  {checkOutLocation.address}
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
