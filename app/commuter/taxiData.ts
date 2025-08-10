// Taxi, Rank, Route, and Fare Data for South Africa

export type Province =
  | 'Gauteng (Johannesburg)'
  | 'Gauteng (Pretoria)'
  | 'Western Cape (Cape Town)'
  | 'KwaZulu-Natal (Durban)'
  | 'Eastern Cape (Gqeberha)'
  | 'Free State'
  | 'Mpumalanga'
  | 'Limpopo'
  | 'North West'
  | 'Northern Cape';

export interface FareRange {
  short: string;
  medium: string;
  long: string;
  keyTerminals: string[];
}

export interface Route {
  from: string;
  to: string;
  fare: string;
  terminals?: string;
  province: Province;
  type: 'urban' | 'intercity' | 'long-distance';
  stops?: string[];
}

export interface Rank {
  name: string;
  city: string;
  province: Province;
  address?: string;
  platforms?: string[];
  routes: string[];
  status?: string;
  facilities?: string[];
}

export const fareStructures: Record<Province, FareRange> = {
  'Gauteng (Johannesburg)': {
    short: 'R7-R15',
    medium: 'R15-R40',
    long: 'R40-R120',
    keyTerminals: ['Baragwanath', 'Bree', 'Noord'],
  },
  'Gauteng (Pretoria)': {
    short: 'R10-R20',
    medium: 'R20-R45',
    long: 'R45-R150',
    keyTerminals: ['Bosman', 'Marabastad'],
  },
  'Western Cape (Cape Town)': {
    short: 'R8-R18',
    medium: 'R18-R50',
    long: 'R50-R180',
    keyTerminals: ['Bellville', 'Khayelitsha'],
  },
  'KwaZulu-Natal (Durban)': {
    short: 'R6-R12',
    medium: 'R12-R35',
    long: 'R35-R100',
    keyTerminals: ['Warwick', 'Umhlanga'],
  },
  'Eastern Cape (Gqeberha)': {
    short: 'R7-R14',
    medium: 'R14-R38',
    long: 'R38-R110',
    keyTerminals: ['Greenacres', 'Korsten'],
  },
  'Free State': {
    short: '-',
    medium: '-',
    long: '-',
    keyTerminals: ['Bloemfontein', 'Welkom'],
  },
  'Mpumalanga': {
    short: '-',
    medium: '-',
    long: '-',
    keyTerminals: ['Nelspruit', 'Middelburg'],
  },
  'Limpopo': {
    short: '-',
    medium: '-',
    long: '-',
    keyTerminals: ['Polokwane', 'Tzaneen'],
  },
  'North West': {
    short: '-',
    medium: '-',
    long: '-',
    keyTerminals: ['Rustenburg', 'Mafikeng'],
  },
  'Northern Cape': {
    short: '-',
    medium: '-',
    long: '-',
    keyTerminals: ['Kimberley', 'Upington'],
  },
};

export const routes: Route[] = [
  // Gauteng (Johannesburg)
  { from: 'Johannesburg CBD', to: 'Alexandra', fare: 'R18', terminals: 'Bree St (Platform 3)', province: 'Gauteng (Johannesburg)', type: 'urban' },
  { from: 'Johannesburg CBD', to: 'Sandton', fare: 'R22', terminals: 'Bree St (Platform 5)', province: 'Gauteng (Johannesburg)', type: 'urban' },
  { from: 'Johannesburg CBD', to: 'Soweto', fare: 'R25', terminals: 'Bree St (Platform 8)', province: 'Gauteng (Johannesburg)', type: 'urban' },
  { from: 'Pretoria CBD', to: 'Mamelodi', fare: 'R20', terminals: 'Bosman Rank (Platform A)', province: 'Gauteng (Pretoria)', type: 'urban' },
  { from: 'Pretoria CBD', to: 'Soshanguve', fare: 'R28', terminals: 'Bosman Rank (Platform C)', province: 'Gauteng (Pretoria)', type: 'urban' },
  { from: 'Midrand', to: 'Randburg', fare: 'R30', terminals: 'Noord St Rank (Platform 2)', province: 'Gauteng (Johannesburg)', type: 'urban' },
  // Western Cape
  { from: 'Cape Town CBD', to: 'Khayelitsha', fare: 'R25', terminals: 'CPT Station (Terminal A)', province: 'Western Cape (Cape Town)', type: 'urban' },
  { from: 'Cape Town CBD', to: 'Mitchells Plain', fare: 'R30', terminals: 'CPT Station (Terminal B)', province: 'Western Cape (Cape Town)', type: 'urban' },
  { from: 'Cape Town CBD', to: 'Gugulethu', fare: 'R22', terminals: 'CPT Station (Terminal C)', province: 'Western Cape (Cape Town)', type: 'urban' },
  { from: 'Bellville', to: 'Stellenbosch', fare: 'R35', terminals: 'Bellville Rank (Platform 4)', province: 'Western Cape (Cape Town)', type: 'urban' },
  { from: 'Bellville', to: 'Paarl', fare: 'R45', terminals: 'Bellville Rank (Platform 7)', province: 'Western Cape (Cape Town)', type: 'urban' },
  // KwaZulu-Natal
  { from: 'Durban CBD', to: 'Umlazi', fare: 'R20', terminals: 'Warwick (Junction Platform)', province: 'KwaZulu-Natal (Durban)', type: 'urban' },
  { from: 'Durban CBD', to: 'KwaMashu', fare: 'R22', terminals: 'Warwick (Platform 6)', province: 'KwaZulu-Natal (Durban)', type: 'urban' },
  { from: 'Durban CBD', to: 'Pinetown', fare: 'R25', terminals: 'Berea Station (Platform 3)', province: 'KwaZulu-Natal (Durban)', type: 'urban' },
  { from: 'Pietermaritzburg', to: 'Howick', fare: 'R28', terminals: 'PMB Rank (Platform B)', province: 'KwaZulu-Natal (Durban)', type: 'urban' },
  // Eastern Cape
  { from: 'Gqeberha CBD', to: 'Motherwell', fare: 'R18', terminals: 'Market Square (Platform 2)', province: 'Eastern Cape (Gqeberha)', type: 'urban' },
  { from: 'East London', to: 'Mdantsane', fare: 'R15', terminals: 'Oxford St Rank (Platform 1)', province: 'Eastern Cape (Gqeberha)', type: 'urban' },
  { from: 'Mthatha', to: 'Coffee Bay', fare: 'R55', terminals: 'Mthatha Rank (Platform 5)', province: 'Eastern Cape (Gqeberha)', type: 'urban' },
  // Free State
  { from: 'Bloemfontein CBD', to: 'Botshabelo', fare: 'R20', terminals: 'Bloem Plaza (Platform A)', province: 'Free State', type: 'urban' },
  { from: 'Welkom', to: 'Virginia', fare: 'R25', terminals: 'Welkom Rank (Platform 3)', province: 'Free State', type: 'urban' },
  // Mpumalanga
  { from: 'Nelspruit', to: 'KaNyamazane', fare: 'R15', terminals: 'Nelspruit Rank (Platform 4)', province: 'Mpumalanga', type: 'urban' },
  { from: 'Middelburg', to: 'Belfast', fare: 'R30', terminals: 'Middelburg Rank (Platform 2)', province: 'Mpumalanga', type: 'urban' },
  // Limpopo
  { from: 'Polokwane', to: 'Seshego', fare: 'R12', terminals: 'Taxi City (Platform 1)', province: 'Limpopo', type: 'urban' },
  { from: 'Tzaneen', to: 'Giyani', fare: 'R60', terminals: 'Tzaneen Rank (Platform A)', province: 'Limpopo', type: 'urban' },
  // North West
  { from: 'Rustenburg', to: 'Phokeng', fare: 'R15', terminals: 'Rustenburg Rank (Platform 3)', province: 'North West', type: 'urban' },
  { from: 'Mafikeng', to: 'Zeerust', fare: 'R50', terminals: 'Mafikeng Rank (Platform B)', province: 'North West', type: 'urban' },
  // Northern Cape
  { from: 'Kimberley CBD', to: 'Galeshewe', fare: 'R12', terminals: 'CBD Rank (Platform 2)', province: 'Northern Cape', type: 'urban' },
  { from: 'Upington', to: 'Kakamas', fare: 'R45', terminals: 'Upington Rank (Platform 4)', province: 'Northern Cape', type: 'urban' },
  // Long-Distance
  { from: 'Johannesburg', to: 'Durban', fare: 'R350', terminals: 'Johannesburg: Ponte City, Durban: Warwick Ave', province: 'Gauteng (Johannesburg)', type: 'long-distance', stops: ['Pietermaritzburg', 'Harrismith'] },
  { from: 'Cape Town', to: 'Port Elizabeth', fare: 'R400', terminals: 'CPT: Cape Town Station, Gqeberha: Market Square', province: 'Western Cape (Cape Town)', type: 'long-distance', stops: ['George', 'Knysna'] },
  { from: 'Pretoria', to: 'Nelspruit', fare: 'R300', terminals: 'Pretoria: Bosman Rank, Nelspruit: Nelspruit Rank', province: 'Gauteng (Pretoria)', type: 'long-distance', stops: ['Middelburg', 'Emalahleni'] },
  { from: 'Durban', to: 'Pietermaritzburg', fare: 'R120', terminals: 'Durban: Berea Station, PMB: Taxi Rank', province: 'KwaZulu-Natal (Durban)', type: 'long-distance' },
  { from: 'Bloemfontein', to: 'Johannesburg', fare: 'R320', terminals: 'Bloemfontein: Bloem Plaza, JHB: Park Station', province: 'Free State', type: 'long-distance' },
];

export const ranks: Rank[] = [
  { name: 'Bree Street', city: 'Johannesburg', province: 'Gauteng (Johannesburg)', platforms: ['Platform 3', 'Platform 5', 'Platform 8'], routes: ['Johannesburg CBD → Alexandra', 'Johannesburg CBD → Sandton', 'Johannesburg CBD → Soweto'] },
  { name: 'Bosman', city: 'Pretoria', province: 'Gauteng (Pretoria)', platforms: ['Platform A', 'Platform C'], routes: ['Pretoria CBD → Mamelodi', 'Pretoria CBD → Soshanguve'] },
  { name: 'Noord Street', city: 'Johannesburg', province: 'Gauteng (Johannesburg)', platforms: ['Platform 2'], routes: ['Midrand → Randburg'] },
  { name: 'Bellville', city: 'Cape Town', province: 'Western Cape (Cape Town)', platforms: ['Platform 4', 'Platform 7'], routes: ['Bellville → Stellenbosch', 'Bellville → Paarl'] },
  { name: 'CPT Station', city: 'Cape Town', province: 'Western Cape (Cape Town)', platforms: ['Terminal A', 'Terminal B', 'Terminal C'], routes: ['Cape Town CBD → Khayelitsha', 'Cape Town CBD → Mitchells Plain', 'Cape Town CBD → Gugulethu'] },
  { name: 'Warwick', city: 'Durban', province: 'KwaZulu-Natal (Durban)', platforms: ['Junction Platform', 'Platform 6'], routes: ['Durban CBD → Umlazi', 'Durban CBD → KwaMashu'] },
  { name: 'Berea Station', city: 'Durban', province: 'KwaZulu-Natal (Durban)', platforms: ['Platform 3'], routes: ['Durban CBD → Pinetown'] },
  { name: 'PMB Rank', city: 'Pietermaritzburg', province: 'KwaZulu-Natal (Durban)', platforms: ['Platform B'], routes: ['Pietermaritzburg → Howick'] },
  { name: 'Market Square', city: 'Gqeberha', province: 'Eastern Cape (Gqeberha)', platforms: ['Platform 2'], routes: ['Gqeberha CBD → Motherwell'] },
  { name: 'Oxford St Rank', city: 'East London', province: 'Eastern Cape (Gqeberha)', platforms: ['Platform 1'], routes: ['East London → Mdantsane'] },
  { name: 'Mthatha Rank', city: 'Mthatha', province: 'Eastern Cape (Gqeberha)', platforms: ['Platform 5'], routes: ['Mthatha → Coffee Bay'] },
  { name: 'Bloem Plaza', city: 'Bloemfontein', province: 'Free State', platforms: ['Platform A'], routes: ['Bloemfontein CBD → Botshabelo'] },
  { name: 'Welkom Rank', city: 'Welkom', province: 'Free State', platforms: ['Platform 3'], routes: ['Welkom → Virginia'] },
  { name: 'Nelspruit Rank', city: 'Nelspruit', province: 'Mpumalanga', platforms: ['Platform 4'], routes: ['Nelspruit → KaNyamazane'] },
  { name: 'Middelburg Rank', city: 'Middelburg', province: 'Mpumalanga', platforms: ['Platform 2'], routes: ['Middelburg → Belfast'] },
  { name: 'Taxi City', city: 'Polokwane', province: 'Limpopo', platforms: ['Platform 1'], routes: ['Polokwane → Seshego'] },
  { name: 'Tzaneen Rank', city: 'Tzaneen', province: 'Limpopo', platforms: ['Platform A'], routes: ['Tzaneen → Giyani'] },
  { name: 'Rustenburg Rank', city: 'Rustenburg', province: 'North West', platforms: ['Platform 3'], routes: ['Rustenburg → Phokeng'] },
  { name: 'Mafikeng Rank', city: 'Mafikeng', province: 'North West', platforms: ['Platform B'], routes: ['Mafikeng → Zeerust'] },
  { name: 'CBD Rank', city: 'Kimberley', province: 'Northern Cape', platforms: ['Platform 2'], routes: ['Kimberley CBD → Galeshewe'] },
  { name: 'Upington Rank', city: 'Upington', province: 'Northern Cape', platforms: ['Platform 4'], routes: ['Upington → Kakamas'] },
]; 