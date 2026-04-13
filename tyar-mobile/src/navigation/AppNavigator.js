import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen        from '../screens/HomeScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import ChargerScreen     from '../screens/ChargerScreen';
import MaintenanceScreen from '../screens/MaintenanceScreen';
import CarDetailScreen   from '../screens/CarDetailScreen';

import { useApp } from '../constants/AppContext';

const Tab   = createBottomTabNavigator();
const Stack = createStackNavigator();

const TAB_ICONS = {
  Home:        ['home',       'home-outline'      ],
  Marketplace: ['car-sport',  'car-sport-outline' ],
  Charger:     ['flash',      'flash-outline'     ],
  Maintenance: ['construct',  'construct-outline' ],
};

function MarketplaceStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MarketplaceList" component={MarketplaceScreen} />
      <Stack.Screen name="CarDetail"       component={CarDetailScreen}   />
    </Stack.Navigator>
  );
}

function Tabs() {
  const { colors, tr } = useApp();

  const TAB_LABELS = {
    Home:        tr.home,
    Marketplace: tr.marketplace,
    Charger:     tr.charger,
    Maintenance: tr.maintenance,
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor:   colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor:  colors.border,
          borderTopWidth:  1,
          height:          64,
          paddingBottom:   10,
          paddingTop:      6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color }) => {
          const [active, inactive] = TAB_ICONS[route.name];
          return <Ionicons name={focused ? active : inactive} size={22} color={color} />;
        },
        tabBarLabel: TAB_LABELS[route.name],
      })}
    >
      <Tab.Screen name="Home"        component={HomeScreen}       />
      <Tab.Screen name="Marketplace" component={MarketplaceStack} />
      <Tab.Screen name="Charger"     component={ChargerScreen}    />
      <Tab.Screen name="Maintenance" component={MaintenanceScreen}/>
    </Tab.Navigator>
  );
}

export default Tabs;
