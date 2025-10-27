import { PropertyImage } from "./property-image.model";


export interface Property {
  id: number;
  title: string;
  description: string;
  price: number;
  area?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  images?: PropertyImage[]
  agentId: number;
}
