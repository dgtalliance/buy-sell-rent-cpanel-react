import { config } from '../../core/config';
import { GetIdxForms } from '../interfaces/responses';

export class IdxFormsService {
  private baseUrl = `${config.api.idxboost}/idxforms`;

  private buildQuery(params: Record<string, any>) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        query.append(key, String(value));
      }
    });
    return query.toString();
  }

  async list(registration_key: string, page = 1, limit = 20): Promise<GetIdxForms> {
    const query = this.buildQuery({ registration_key, page, limit });

    const res = await fetch(`${this.baseUrl}?${query}`);
    if (!res.ok) throw new Error('Error fetching idxforms list');
    return res.json();
  }

  async getById(id: number) {
    const res = await fetch(`${this.baseUrl}/${id}`);
    if (!res.ok) throw new Error('Error fetching idxform by ID');
    return res.json();
  }

  async getBySlug(slug: string) {
    const res = await fetch(`${this.baseUrl}/slug/${slug}`);
    if (!res.ok) throw new Error('Error fetching idxform by slug');
    return res.json();
  }

  async create(data: any) {
    const res = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Error creating idxform');
    return res.json();
  }

  async update(id: number, data: any) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error('Error updating idxform');
    return res.json();
  }

  async delete(id: number) {
    const res = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error('Error deleting idxform');
    return res.json();
  }
}
