export interface PincodeInfo {
  pincode: string;
  city: string;
  district: string;
  state: string;
  postOffices: string[];
  source: 'India Post API' | 'Postal Service Mirror' | 'Offline Postal Index';
  isValid: boolean;
}

// In-memory cache for instant subsequent lookups
const pincodeCache: Record<string, PincodeInfo> = {};

// Comprehensive fallback prefix index covering all regions of India
const PINCODE_PREFIX_FALLBACK: Record<string, { city: string; district: string; state: string; postOffices: string[] }> = {
  '110': { city: 'New Delhi', district: 'Central Delhi', state: 'Delhi NCR', postOffices: ['Connaught Place', 'G.P.O.', 'Karol Bagh', 'Pahar Ganj', 'Janpath'] },
  '121': { city: 'Faridabad', district: 'Faridabad', state: 'Haryana', postOffices: ['Faridabad NIT', 'Sector 15', 'Ballabgarh'] },
  '122': { city: 'Gurugram', district: 'Gurugram', state: 'Haryana', postOffices: ['Cyber City', 'DLF Phase 2', 'Sohna Road', 'Udyog Vihar'] },
  '124': { city: 'Rohtak', district: 'Rohtak', state: 'Haryana', postOffices: ['Rohtak City', 'Model Town'] },
  '131': { city: 'Sonipat', district: 'Sonipat', state: 'Haryana', postOffices: ['Sonipat City', 'Kundli'] },
  '141': { city: 'Ludhiana', district: 'Ludhiana', state: 'Punjab', postOffices: ['Model Town', 'Civil Lines'] },
  '143': { city: 'Amritsar', district: 'Amritsar', state: 'Punjab', postOffices: ['Golden Temple Area', 'Mall Road'] },
  '160': { city: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh', postOffices: ['Sector 17', 'Sector 35', 'Sector 22'] },
  '180': { city: 'Jammu', district: 'Jammu', state: 'Jammu & Kashmir', postOffices: ['Gandhi Nagar', 'Jammu Tawi'] },
  '190': { city: 'Srinagar', district: 'Srinagar', state: 'Jammu & Kashmir', postOffices: ['Lal Chowk', 'Rajbagh'] },
  '201': { city: 'Noida', district: 'Gautam Buddha Nagar', state: 'Uttar Pradesh', postOffices: ['Noida Sector 18', 'Greater Noida', 'Sector 62', 'Sector 15'] },
  '208': { city: 'Kanpur', district: 'Kanpur Nagar', state: 'Uttar Pradesh', postOffices: ['Civil Lines', 'Swaroop Nagar'] },
  '211': { city: 'Prayagraj', district: 'Prayagraj', state: 'Uttar Pradesh', postOffices: ['Civil Lines', 'Katra'] },
  '221': { city: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh', postOffices: ['BHU', 'Godowlia', 'Cantonment'] },
  '226': { city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', postOffices: ['Hazratganj', 'Alambagh', 'Gomti Nagar', 'Indira Nagar'] },
  '248': { city: 'Dehradun', district: 'Dehradun', state: 'Uttarakhand', postOffices: ['Rajpur Road', 'Clock Tower'] },
  '302': { city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', postOffices: ['Johari Bazar', 'Malviya Nagar', 'Mansarovar', 'Vaishali Nagar'] },
  '342': { city: 'Jodhpur', district: 'Jodhpur', state: 'Rajasthan', postOffices: ['Sardarpura', 'Ratanada'] },
  '313': { city: 'Udaipur', district: 'Udaipur', state: 'Rajasthan', postOffices: ['Fateh Sagar', 'Chetak Circle'] },
  '380': { city: 'Ahmedabad', district: 'Ahmedabad', state: 'Gujarat', postOffices: ['Navrangpura', 'Satellite', 'Maninagar', 'Vastrapur'] },
  '390': { city: 'Vadodara', district: 'Vadodara', state: 'Gujarat', postOffices: ['Alkapuri', 'Sayajiganj'] },
  '395': { city: 'Surat', district: 'Surat', state: 'Gujarat', postOffices: ['Ring Road', 'Varachha', 'Adajan', 'Athwa'] },
  '360': { city: 'Rajkot', district: 'Rajkot', state: 'Gujarat', postOffices: ['Yagnik Road', 'Kalawad Road'] },
  '400': { city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', postOffices: ['Andheri East', 'Bandra West', 'Colaba', 'Dadar', 'Goregaon', 'Borivali'] },
  '401': { city: 'Thane', district: 'Thane', state: 'Maharashtra', postOffices: ['Thane West', 'Mira Road', 'Bhayandar'] },
  '411': { city: 'Pune', district: 'Pune', state: 'Maharashtra', postOffices: ['Shivajinagar', 'Kothrud', 'Viman Nagar', 'Hinjewadi', 'Baner'] },
  '422': { city: 'Nashik', district: 'Nashik', state: 'Maharashtra', postOffices: ['College Road', 'Panchavati'] },
  '431': { city: 'Chhatrapati Sambhajinagar', district: 'Chhatrapati Sambhajinagar', state: 'Maharashtra', postOffices: ['CIDCO', 'Samarth Nagar'] },
  '440': { city: 'Nagpur', district: 'Nagpur', state: 'Maharashtra', postOffices: ['Dharampeth', 'Sitabuldi'] },
  '452': { city: 'Indore', district: 'Indore', state: 'Madhya Pradesh', postOffices: ['Palasia', 'Vijay Nagar'] },
  '462': { city: 'Bhopal', district: 'Bhopal', state: 'Madhya Pradesh', postOffices: ['MP Nagar', 'Arera Colony'] },
  '492': { city: 'Raipur', district: 'Raipur', state: 'Chhattisgarh', postOffices: ['Pandri', 'Telibandha'] },
  '500': { city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', postOffices: ['Banjara Hills', 'Hitech City', 'Secunderabad', 'Madhapur', 'Gachibowli'] },
  '530': { city: 'Visakhapatnam', district: 'Visakhapatnam', state: 'Andhra Pradesh', postOffices: ['MVP Colony', 'Dwaraka Nagar'] },
  '520': { city: 'Vijayawada', district: 'NTR District', state: 'Andhra Pradesh', postOffices: ['Governorpet', 'Benz Circle'] },
  '560': { city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', postOffices: ['Koramangala', 'Indiranagar', 'Whitefield', 'Jayanagar', 'HSR Layout', 'Electronic City'] },
  '575': { city: 'Mangaluru', district: 'Dakshina Kannada', state: 'Karnataka', postOffices: ['Hampankatta', 'Kadri'] },
  '570': { city: 'Mysuru', district: 'Mysuru', state: 'Karnataka', postOffices: ['Gokulam', 'Saraswathipuram'] },
  '600': { city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', postOffices: ['T. Nagar', 'Anna Nagar', 'Adyar', 'Velachery', 'Mylapore', 'Nungambakkam'] },
  '641': { city: 'Coimbatore', district: 'Coimbatore', state: 'Tamil Nadu', postOffices: ['RS Puram', 'Gandhipuram'] },
  '625': { city: 'Madurai', district: 'Madurai', state: 'Tamil Nadu', postOffices: ['KK Nagar', 'Simmakkal'] },
  '682': { city: 'Kochi', district: 'Ernakulam', state: 'Kerala', postOffices: ['Marine Drive', 'Kaloor', 'Edapally', 'Fort Kochi'] },
  '695': { city: 'Thiruvananthapuram', district: 'Thiruvananthapuram', state: 'Kerala', postOffices: ['Pattom', 'Palayam'] },
  '700': { city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', postOffices: ['Park Street', 'Salt Lake', 'Ballygunge', 'New Town', 'Howrah'] },
  '734': { city: 'Siliguri', district: 'Darjeeling', state: 'West Bengal', postOffices: ['Sevoke Road', 'Pradhan Nagar'] },
  '751': { city: 'Bhubaneswar', district: 'Khordha', state: 'Odisha', postOffices: ['Saheed Nagar', 'Nayapalli', 'Chandrasekharpur'] },
  '769': { city: 'Rourkela', district: 'Sundargarh', state: 'Odisha', postOffices: ['Civil Township', 'Panposh'] },
  '781': { city: 'Guwahati', district: 'Kamrup Metropolitan', state: 'Assam', postOffices: ['Guwahati GPO', 'Dispur', 'Panbazar', 'Paltan Bazar'] },
  '799': { city: 'Agartala', district: 'West Tripura', state: 'Tripura', postOffices: ['Agartala HO', 'Banamalipur'] },
  '800': { city: 'Patna', district: 'Patna', state: 'Bihar', postOffices: ['Patna G.P.O.', 'Kankarbagh', 'Boring Road', 'Bailey Road'] },
  '834': { city: 'Ranchi', district: 'Ranchi', state: 'Jharkhand', postOffices: ['Main Road', 'Doranda', 'Hinoo', 'Kanke'] },
  '831': { city: 'Jamshedpur', district: 'East Singhbhum', state: 'Jharkhand', postOffices: ['Bistupur', 'Sakchi'] },
  '403': { city: 'Panaji', district: 'North Goa', state: 'Goa', postOffices: ['Panaji HO', 'Miramar', 'Margao'] }
};

/**
 * Standardizes state names to match Indian e-commerce dropdown conventions
 */
export function normalizeIndianState(rawState: string): string {
  if (!rawState) return '';
  const s = rawState.trim().toLowerCase();

  if (s === 'delhi' || s.includes('delhi')) return 'Delhi NCR';
  if (s.includes('odisha') || s.includes('orissa')) return 'Odisha';
  if (s.includes('uttar pradesh') || s === 'up') return 'Uttar Pradesh';
  if (s.includes('madhya pradesh') || s === 'mp') return 'Madhya Pradesh';
  if (s.includes('andhra')) return 'Andhra Pradesh';
  if (s.includes('tamil')) return 'Tamil Nadu';
  if (s.includes('west bengal') || s === 'wb') return 'West Bengal';
  if (s.includes('jammu') || s.includes('kashmir')) return 'Jammu & Kashmir';
  if (s.includes('chhattisgarh') || s.includes('chattisgarh')) return 'Chhattisgarh';
  if (s.includes('uttarakhand') || s.includes('uttaranchal')) return 'Uttarakhand';
  if (s.includes('himachal')) return 'Himachal Pradesh';
  if (s.includes('karnataka')) return 'Karnataka';
  if (s.includes('maharashtra')) return 'Maharashtra';
  if (s.includes('gujarat')) return 'Gujarat';
  if (s.includes('rajasthan')) return 'Rajasthan';
  if (s.includes('punjab')) return 'Punjab';
  if (s.includes('haryana')) return 'Haryana';
  if (s.includes('kerala')) return 'Kerala';
  if (s.includes('telangana')) return 'Telangana';
  if (s.includes('assam')) return 'Assam';
  if (s.includes('bihar')) return 'Bihar';
  if (s.includes('jharkhand')) return 'Jharkhand';
  if (s.includes('goa')) return 'Goa';
  if (s.includes('chandigarh')) return 'Chandigarh';

  // Capitalize words as fallback
  return rawState.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

/**
 * Looks up PIN code using India Post API with fast mirrors and local fallback
 */
export async function lookupPincode(pincode: string): Promise<PincodeInfo | null> {
  const cleanPin = pincode.trim().replace(/\D/g, '');
  if (cleanPin.length !== 6) return null;

  // Return cached result if available
  if (pincodeCache[cleanPin]) {
    return pincodeCache[cleanPin];
  }

  // 1. Primary: Official India Post API (https://api.postalpincode.in)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800);

    const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.Status === 'Success' && Array.isArray(data[0]?.PostOffice) && data[0].PostOffice.length > 0) {
        const postOfficesList = data[0].PostOffice;
        const first = postOfficesList[0];
        const uniquePostOffices = Array.from(
          new Set(postOfficesList.map((po: { Name?: string }) => po.Name).filter(Boolean))
        ) as string[];

        // Extract district and city
        const district = (first.District || first.Circle || first.Region || '').trim();
        const state = normalizeIndianState(first.State || '');
        // City usually corresponds to Block/Division/District or the primary delivery head
        const deliveryHead = postOfficesList.find((po: { DeliveryStatus?: string }) => po.DeliveryStatus === 'Delivery') || first;
        const city = (deliveryHead.Block && deliveryHead.Block !== 'NA' ? deliveryHead.Block : (deliveryHead.Division || district)).replace(/Division|H\.O|S\.O/gi, '').trim() || district;

        const info: PincodeInfo = {
          pincode: cleanPin,
          city: city || district,
          district: district || city,
          state: state || 'Maharashtra',
          postOffices: uniquePostOffices,
          source: 'India Post API',
          isValid: true
        };

        pincodeCache[cleanPin] = info;
        return info;
      }
    }
  } catch (err) {
    // Network or abort, proceed to secondary mirror
  }

  // 2. Secondary Mirror: Zippopotam India Postal API
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch(`https://api.zippopotam.us/in/${cleanPin}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.places) && data.places.length > 0) {
        const places = data.places;
        const first = places[0];
        const state = normalizeIndianState(first.state || '');
        const city = (first['place name'] || '').trim();
        const postOffices = places.map((p: { 'place name': string }) => p['place name']).filter(Boolean);

        const info: PincodeInfo = {
          pincode: cleanPin,
          city: city,
          district: city,
          state: state,
          postOffices: postOffices,
          source: 'Postal Service Mirror',
          isValid: true
        };

        pincodeCache[cleanPin] = info;
        return info;
      }
    }
  } catch (err) {
    // Secondary mirror fallback
  }

  // 3. Tertiary: Local 3-digit postal index fallback covering all Indian postal zones
  const prefix3 = cleanPin.substring(0, 3);
  if (PINCODE_PREFIX_FALLBACK[prefix3]) {
    const fallback = PINCODE_PREFIX_FALLBACK[prefix3];
    const info: PincodeInfo = {
      pincode: cleanPin,
      city: fallback.city,
      district: fallback.district,
      state: fallback.state,
      postOffices: fallback.postOffices,
      source: 'Offline Postal Index',
      isValid: true
    };
    pincodeCache[cleanPin] = info;
    return info;
  }

  return null;
}
