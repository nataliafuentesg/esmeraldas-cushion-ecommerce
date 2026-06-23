/**
 * Departamentos de Colombia con sus principales ciudades/municipios.
 * Para el checkout: el cliente selecciona departamento → ciudad, así la
 * dirección queda estructurada y completa (no toca volver a preguntar).
 *
 * Cada lista incluye las ciudades más comunes; "Otra ciudad" permite escribir
 * un municipio que no esté listado.
 */
export const COLOMBIA = {
  'Bogotá D.C.': ['Bogotá'],
  'Amazonas': ['Leticia', 'Puerto Nariño', 'Otra ciudad'],
  'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Sabaneta', 'La Estrella', 'Rionegro', 'Apartadó', 'Turbo', 'Caucasia', 'Copacabana', 'Girardota', 'Marinilla', 'El Carmen de Viboral', 'Otra ciudad'],
  'Arauca': ['Arauca', 'Saravena', 'Tame', 'Arauquita', 'Otra ciudad'],
  'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga', 'Puerto Colombia', 'Galapa', 'Baranoa', 'Otra ciudad'],
  'Bolívar': ['Cartagena', 'Magangué', 'Turbaco', 'El Carmen de Bolívar', 'Arjona', 'Otra ciudad'],
  'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa', 'Villa de Leyva', 'Otra ciudad'],
  'Caldas': ['Manizales', 'La Dorada', 'Chinchiná', 'Villamaría', 'Riosucio', 'Otra ciudad'],
  'Caquetá': ['Florencia', 'San Vicente del Caguán', 'Otra ciudad'],
  'Casanare': ['Yopal', 'Aguazul', 'Villanueva', 'Otra ciudad'],
  'Cauca': ['Popayán', 'Santander de Quilichao', 'Puerto Tejada', 'Otra ciudad'],
  'Cesar': ['Valledupar', 'Aguachica', 'Bosconia', 'Otra ciudad'],
  'Chocó': ['Quibdó', 'Istmina', 'Otra ciudad'],
  'Córdoba': ['Montería', 'Cereté', 'Lorica', 'Sahagún', 'Planeta Rica', 'Otra ciudad'],
  'Cundinamarca': ['Soacha', 'Zipaquirá', 'Facatativá', 'Chía', 'Mosquera', 'Madrid', 'Funza', 'Cajicá', 'Girardot', 'Fusagasugá', 'Cota', 'La Calera', 'Sopó', 'Tocancipá', 'Tenjo', 'Otra ciudad'],
  'Guainía': ['Inírida', 'Otra ciudad'],
  'Guaviare': ['San José del Guaviare', 'Otra ciudad'],
  'Huila': ['Neiva', 'Pitalito', 'Garzón', 'La Plata', 'Otra ciudad'],
  'La Guajira': ['Riohacha', 'Maicao', 'Uribia', 'Fonseca', 'Otra ciudad'],
  'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco', 'Otra ciudad'],
  'Meta': ['Villavicencio', 'Acacías', 'Granada', 'Puerto López', 'Otra ciudad'],
  'Nariño': ['Pasto', 'Ipiales', 'Tumaco', 'Túquerres', 'Otra ciudad'],
  'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario', 'Los Patios', 'Otra ciudad'],
  'Putumayo': ['Mocoa', 'Puerto Asís', 'Otra ciudad'],
  'Quindío': ['Armenia', 'Calarcá', 'Montenegro', 'La Tebaida', 'Otra ciudad'],
  'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia', 'Otra ciudad'],
  'San Andrés y Providencia': ['San Andrés', 'Providencia', 'Otra ciudad'],
  'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja', 'San Gil', 'Otra ciudad'],
  'Sucre': ['Sincelejo', 'Corozal', 'Sampués', 'Otra ciudad'],
  'Tolima': ['Ibagué', 'Espinal', 'Melgar', 'Honda', 'Chaparral', 'Otra ciudad'],
  'Valle del Cauca': ['Cali', 'Palmira', 'Buenaventura', 'Tuluá', 'Cartago', 'Buga', 'Jamundí', 'Yumbo', 'Otra ciudad'],
  'Vaupés': ['Mitú', 'Otra ciudad'],
  'Vichada': ['Puerto Carreño', 'Otra ciudad'],
};

export const DEPARTAMENTOS = Object.keys(COLOMBIA);
