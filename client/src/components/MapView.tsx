import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Company } from '@/lib/dataLoader';

// Fix for default marker icons in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  companies: Company[];
}

// Helper to get marker color based on overall score
function getMarkerColor(score: number): string {
  if (score >= 9.0) return '#22c55e'; // green - Excellent
  if (score >= 8.5) return '#3b82f6'; // blue - Very Good
  if (score >= 8.0) return '#eab308'; // yellow - Good
  return '#ef4444'; // red - Below Average
}

// Create custom colored marker icon
function createColoredIcon(color: string, score: number) {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 11px;
        ">${score.toFixed(1)}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

// Component to fit map bounds to markers
function FitBounds({ companies }: { companies: Company[] }) {
  const map = useMap();

  useEffect(() => {
    const validCompanies = companies.filter(c => c.latitude && c.longitude);
    if (validCompanies.length > 0) {
      const bounds = L.latLngBounds(
        validCompanies.map(c => [c.latitude!, c.longitude!])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  }, [companies, map]);

  return null;
}

export default function MapView({ companies }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter companies with valid coordinates
  const companiesWithCoords = companies.filter(
    c => c.latitude && c.longitude
  );

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-card rounded-xl border">
        <div className="text-muted-foreground">Loading map...</div>
      </div>
    );
  }

  return (
    <div className="relative h-[600px] rounded-xl overflow-hidden border">
      <MapContainer
        center={[42.3601, -71.0589]} // Boston, MA as default center
        zoom={8}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <FitBounds companies={companiesWithCoords} />

        {companiesWithCoords.map((company) => {
          const score = company['MA_Overall_Fit_Score'] || 0;
          const color = getMarkerColor(score);
          const revenue = company['Revenue Estimate (MUSD)'];
          const profitMargin = company['Estimated Profit Margin (%)'];
          
          return (
            <Marker
              key={company.id}
              position={[company.latitude!, company.longitude!]}
              icon={createColoredIcon(color, score)}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <h3 className="font-semibold text-base mb-1">{company['Company name']}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{company['Business Type']}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Overall Score:</span>
                      <span className="font-medium">{score.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Revenue:</span>
                      <span className="font-medium">${revenue}M</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Profit Margin:</span>
                      <span className="font-medium">{profitMargin}%</span>
                    </div>
                    {company.State_Province && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">State:</span>
                        <span className="font-medium">{company.State_Province}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-card border rounded-lg p-3 shadow-lg">
        <h4 className="font-semibold text-sm mb-2">Overall Fit Score</h4>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#22c55e' }}></div>
            <span>9.0+ Excellent</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#3b82f6' }}></div>
            <span>8.5-8.9 Very Good</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#eab308' }}></div>
            <span>8.0-8.4 Good</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#ef4444' }}></div>
            <span>&lt;8.0 Below Average</span>
          </div>
        </div>
      </div>
    </div>
  );
}

