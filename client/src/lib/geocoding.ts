// Geocoding data for US states and major cities
// This provides approximate coordinates for companies based on their location

interface Coordinates {
  lat: number;
  lng: number;
}

// State center coordinates
const stateCoordinates: Record<string, Coordinates> = {
  'MA': { lat: 42.4072, lng: -71.3824 }, // Massachusetts
  'Massachusetts': { lat: 42.4072, lng: -71.3824 },
  'CT': { lat: 41.6032, lng: -73.0877 }, // Connecticut
  'Connecticut': { lat: 41.6032, lng: -73.0877 },
  'RI': { lat: 41.5801, lng: -71.4774 }, // Rhode Island
  'Rhode Island': { lat: 41.5801, lng: -71.4774 },
  'NH': { lat: 43.1939, lng: -71.5724 }, // New Hampshire
  'New Hampshire': { lat: 43.1939, lng: -71.5724 },
  'VT': { lat: 44.5588, lng: -72.5778 }, // Vermont
  'Vermont': { lat: 44.5588, lng: -72.5778 },
  'ME': { lat: 45.2538, lng: -69.4455 }, // Maine
  'Maine': { lat: 45.2538, lng: -69.4455 },
  'NY': { lat: 42.1657, lng: -74.9481 }, // New York
  'New York': { lat: 42.1657, lng: -74.9481 },
  'NJ': { lat: 40.0583, lng: -74.4057 }, // New Jersey
  'New Jersey': { lat: 40.0583, lng: -74.4057 },
  'PA': { lat: 41.2033, lng: -77.1945 }, // Pennsylvania
  'Pennsylvania': { lat: 41.2033, lng: -77.1945 },
};

// City coordinates for more precise locations
const cityCoordinates: Record<string, Coordinates> = {
  // Massachusetts
  'Boston': { lat: 42.3601, lng: -71.0589 },
  'Cambridge': { lat: 42.3736, lng: -71.1097 },
  'Worcester': { lat: 42.2626, lng: -71.8023 },
  'Springfield': { lat: 42.1015, lng: -72.5898 },
  'Lowell': { lat: 42.6334, lng: -71.3162 },
  'Newton': { lat: 42.3370, lng: -71.2092 },
  'Somerville': { lat: 42.3876, lng: -71.0995 },
  'Framingham': { lat: 42.2793, lng: -71.4162 },
  'Waltham': { lat: 42.3765, lng: -71.2356 },
  'Malden': { lat: 42.4251, lng: -71.0662 },
  'Brookline': { lat: 42.3318, lng: -71.1212 },
  'Quincy': { lat: 42.2529, lng: -71.0023 },
  'Lynn': { lat: 42.4668, lng: -70.9495 },
  'Braintree': { lat: 42.2057, lng: -71.0023 },
  'Needham': { lat: 42.2834, lng: -71.2328 },
  'Lexington': { lat: 42.4473, lng: -71.2245 },
  'Burlington, MA': { lat: 42.5048, lng: -71.1956 },
  'Andover': { lat: 42.6584, lng: -71.1370 },
  'North Grafton': { lat: 42.2251, lng: -71.6856 },
  'Bristol': { lat: 41.6712, lng: -72.9493 },
  
  // Connecticut
  'Hartford': { lat: 41.7658, lng: -72.6734 },
  'New Haven': { lat: 41.3083, lng: -72.9279 },
  'Stamford': { lat: 41.0534, lng: -73.5387 },
  'Bridgeport': { lat: 41.1865, lng: -73.1952 },
  'Waterbury': { lat: 41.5582, lng: -73.0515 },
  
  // Other major cities
  'New York': { lat: 40.7128, lng: -74.0060 },
  'Providence': { lat: 41.8240, lng: -71.4128 },
  'Portland': { lat: 43.6591, lng: -70.2568 },
  'Manchester': { lat: 42.9956, lng: -71.4548 },
  'Burlington, VT': { lat: 44.4759, lng: -73.2121 },
};

/**
 * Get coordinates for a company based on city and state
 * Returns coordinates with slight random offset to avoid marker overlap
 */
export function getCompanyCoordinates(city?: string, state?: string): Coordinates | null {
  // Try city first for more precise location
  if (city) {
    const cityKey = Object.keys(cityCoordinates).find(
      key => key.toLowerCase() === city.toLowerCase()
    );
    if (cityKey) {
      const coords = cityCoordinates[cityKey];
      // Add small random offset to avoid exact overlap (within ~2km)
      return {
        lat: coords.lat + (Math.random() - 0.5) * 0.02,
        lng: coords.lng + (Math.random() - 0.5) * 0.02,
      };
    }
  }

  // Fall back to state
  if (state) {
    const stateKey = Object.keys(stateCoordinates).find(
      key => key.toLowerCase() === state.toLowerCase()
    );
    if (stateKey) {
      const coords = stateCoordinates[stateKey];
      // Add larger random offset for state-level coordinates (within ~20km)
      return {
        lat: coords.lat + (Math.random() - 0.5) * 0.2,
        lng: coords.lng + (Math.random() - 0.5) * 0.2,
      };
    }
  }

  return null;
}

/**
 * Add coordinates to companies array
 */
export function addCoordinatesToCompanies<T extends { City?: string; State_Province?: string; State_From_Analysis?: string }>(
  companies: T[]
): (T & { latitude?: number; longitude?: number })[] {
  return companies.map(company => {
    const city = company.City;
    const state = company.State_Province || company.State_From_Analysis;
    const coords = getCompanyCoordinates(city, state);
    
    return {
      ...company,
      latitude: coords?.lat,
      longitude: coords?.lng,
    };
  });
}

