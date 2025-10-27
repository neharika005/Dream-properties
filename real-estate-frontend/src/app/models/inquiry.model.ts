export interface Inquiry {
  id: number;
  propertyId: number;
  propertyTitle?: string;
  name: string;
  email: string;
  message: string;
  status: string;
  buyerId?: number;
  createdAt?: string;
  agentName?: string;
  date?: string | Date;   // <-- add this property
}
