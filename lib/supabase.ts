import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// API service class for backend calls
export class APIService {
  private static baseURL = '/api'

  static async post(endpoint: string, data: any, token?: string) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    })

    return response.json()
  }

  // Authentication methods
  static async signUp(email: string, password: string, phone: string, userType: string, userData: any) {
    return this.post('/auth', {
      action: 'signup',
      email,
      password,
      phone,
      userType,
      userData
    })
  }

  static async signIn(email: string, password: string) {
    return this.post('/auth', {
      action: 'signin',
      email,
      password
    })
  }

  static async signOut() {
    return this.post('/auth', { action: 'signout' })
  }

  static async resetPassword(email: string) {
    return this.post('/auth', {
      action: 'reset_password',
      email
    })
  }

  // Booking methods
  static async createBooking(bookingData: any, token: string) {
    return this.post('/bookings', {
      action: 'create_booking',
      bookingData
    }, token)
  }

  static async acceptBooking(bookingId: string, token: string) {
    return this.post('/bookings', {
      action: 'accept_booking',
      bookingId
    }, token)
  }

  static async updateTripStatus(bookingId: string, status: string, token: string) {
    return this.post('/bookings', {
      action: 'update_trip_status',
      bookingId,
      status
    }, token)
  }

  static async getBookings(token: string) {
    return this.post('/bookings', {
      action: 'get_bookings'
    }, token)
  }

  static async getDriverRequests(token: string) {
    return this.post('/bookings', {
      action: 'get_driver_requests'
    }, token)
  }

  static async cancelBooking(bookingId: string, token: string) {
    return this.post('/bookings', {
      action: 'cancel_booking',
      bookingId
    }, token)
  }

  // Payment methods
  static async topUpWallet(amount: number, paymentMethod: string, token: string, cardToken?: string, phoneNumber?: string) {
    return this.post('/payments', {
      action: 'top_up_wallet',
      amount,
      paymentMethod,
      cardToken,
      phoneNumber
    }, token)
  }

  static async getWalletBalance(token: string) {
    return this.post('/payments', {
      action: 'get_wallet_balance'
    }, token)
  }

  static async getTransactions(token: string) {
    return this.post('/payments', {
      action: 'get_transactions'
    }, token)
  }

  static async processTripPayment(tripId: string, fareAmount: number, token: string) {
    return this.post('/payments', {
      action: 'process_trip_payment',
      tripId,
      fareAmount
    }, token)
  }

  static async driverWithdrawal(withdrawalAmount: number, bankDetails: any, token: string) {
    return this.post('/payments', {
      action: 'driver_withdrawal',
      withdrawalAmount,
      bankDetails
    }, token)
  }

  // Notification methods
  static async getNotifications(token: string) {
    return this.post('/notifications', {
      action: 'get_notifications'
    }, token)
  }

  static async markAsRead(notificationId: string, token: string) {
    return this.post('/notifications', {
      action: 'mark_as_read',
      notificationId
    }, token)
  }

  static async markAllAsRead(token: string) {
    return this.post('/notifications', {
      action: 'mark_all_as_read'
    }, token)
  }

  static async updateNotificationSettings(settings: any, token: string) {
    return this.post('/notifications', {
      action: 'update_settings',
      settings
    }, token)
  }

  // Location methods
  static async getPopularRoutes() {
    return this.post('/locations', {
      action: 'get_popular_routes'
    })
  }

  static async getTaxiRanks() {
    return this.post('/locations', {
      action: 'get_taxi_ranks'
    })
  }

  static async findNearbyDrivers(pickup_lat: number, pickup_lng: number, radius?: number) {
    return this.post('/locations', {
      action: 'find_nearby_drivers',
      pickup_lat,
      pickup_lng,
      radius
    })
  }

  static async updateDriverLocation(location: { lat: number, lng: number, heading?: number, speed?: number }, token: string) {
    return this.post('/locations', {
      action: 'update_driver_location',
      location
    }, token)
  }

  static async getRouteDetails(from: string, to: string) {
    return this.post('/locations', {
      action: 'get_route_details',
      from,
      to
    })
  }

  // AI Assistant
  static async chatWithAssistant(message: string, context?: string, history?: any[]) {
    return this.post('/ai-assistant', {
      message,
      context,
      history
    })
  }
}

export default APIService

// Env typing (augment global)
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SUPABASE_URL: string
      NEXT_PUBLIC_SUPABASE_ANON_KEY: string
      SUPABASE_SERVICE_ROLE_KEY?: string
      ENCRYPTION_KEY?: string
    }
  }
}