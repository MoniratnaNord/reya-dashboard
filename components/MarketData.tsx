"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Activity, Volume, DollarSign, Zap } from 'lucide-react';

interface MarketDataType {
  platform: string;
  assets: {
    symbol: string;
    name: string;
    price: number;
    change24h: number;
    volume24h: number;
    marketCap: number;
    liquidity: number;
    apy: number;
  }[];
  platformStats: {
    totalVolume: number;
    totalLiquidity: number;
    activeUsers: number;
    avgApy: number;
  };
}

const mockMarketData: Record<string, MarketDataType> = {
  reya: {
    platform: 'Reya',
    assets: [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 2340.50,
        change24h: 3.2,
        volume24h: 1250000,
        marketCap: 281500000000,
        liquidity: 45000000,
        apy: 8.5,
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 43250.75,
        change24h: -1.8,
        volume24h: 2100000,
        marketCap: 847000000000,
        liquidity: 78000000,
        apy: 6.2,
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        price: 98.45,
        change24h: 5.7,
        volume24h: 890000,
        marketCap: 42800000000,
        liquidity: 12000000,
        apy: 12.3,
      },
    ],
    platformStats: {
      totalVolume: 4240000,
      totalLiquidity: 135000000,
      activeUsers: 12500,
      avgApy: 9.0,
    },
  },
  hyperliquid: {
    platform: 'Hyperliquid',
    assets: [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 2342.80,
        change24h: 2.9,
        volume24h: 1850000,
        marketCap: 281500000000,
        liquidity: 62000000,
        apy: 9.2,
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 43180.25,
        change24h: -2.1,
        volume24h: 3200000,
        marketCap: 847000000000,
        liquidity: 95000000,
        apy: 7.1,
      },
      {
        symbol: 'AVAX',
        name: 'Avalanche',
        price: 36.75,
        change24h: 4.3,
        volume24h: 650000,
        marketCap: 13500000000,
        liquidity: 8500000,
        apy: 15.8,
      },
    ],
    platformStats: {
      totalVolume: 5700000,
      totalLiquidity: 165500000,
      activeUsers: 18200,
      avgApy: 10.7,
    },
  },
};

export function MarketData() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('');
  
  const data = selectedPlatform ? mockMarketData[selectedPlatform] : null;

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
    return num.toFixed(decimals);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Market Data</h1>
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Platform" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reya">Reya</SelectItem>
            <SelectItem value="hyperliquid">Hyperliquid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!selectedPlatform ? (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select a platform to view market data</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Platform Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Volume</CardTitle>
                <Volume className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${formatNumber(data?.platformStats.totalVolume || 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Liquidity</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${formatNumber(data?.platformStats.totalLiquidity || 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {formatNumber(data?.platformStats.activeUsers || 0, 0)}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Avg APY</CardTitle>
                <Zap className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {data?.platformStats.avgApy}%
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Asset Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {data?.assets.map((asset) => (
              <Card key={asset.symbol} className="bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-gray-900">{asset.symbol}</CardTitle>
                      <p className="text-sm text-gray-600">{asset.name}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        ${asset.price.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        {asset.change24h >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600 mr-1" />
                        )}
                        <span className={`text-sm font-semibold ${asset.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {asset.change24h > 0 ? '+' : ''}{asset.change24h}%
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Volume 24h</p>
                      <p className="font-semibold text-gray-900">${formatNumber(asset.volume24h)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Market Cap</p>
                      <p className="font-semibold text-gray-900">${formatNumber(asset.marketCap)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Liquidity</p>
                      <p className="font-semibold text-gray-900">${formatNumber(asset.liquidity)}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">APY</p>
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                        {asset.apy}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}