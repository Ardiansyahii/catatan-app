import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import useThemeStore, { getThemeColors } from '../store/useThemeStore';

export default function LoginScreen({ navigation }) {
  const { isDark } = useThemeStore();
  const colors = getThemeColors(isDark);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleAuth() {
    try {
      if (isSignUp) {
        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
          Alert.alert('Error', 'Semua field wajib diisi');
          return;
        }
        if (password !== confirmPassword) {
          Alert.alert('Error', 'Password dan konfirmasi password tidak cocok');
          return;
        }
        if (password.length < 6) {
          Alert.alert('Error', 'Password minimal 6 karakter');
          return;
        }

        setLoading(true);
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { name: name.trim() } },
        });
        setLoading(false);

        if (error) {
          Alert.alert('Error', error.message);
        } else if (data.user && !data.session) {
          Alert.alert('Berhasil', 'Akun berhasil dibuat! Silakan login.');
          setIsSignUp(false);
          setName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        } else {
          navigation.replace('Main');
        }
      } else {
        if (!email.trim() || !password) {
          Alert.alert('Error', 'Email dan password wajib diisi');
          return;
        }

        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        setLoading(false);

        if (error) {
          Alert.alert('Error', error.message);
        } else {
          navigation.replace('Main');
        }
      }
    } catch (err) {
      setLoading(false);
      Alert.alert('Error', 'Terjadi kesalahan: ' + err.message);
    }
  }

  function toggleMode() {
    setIsSignUp(!isSignUp);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={[styles.headerIcon, { backgroundColor: colors.headerBg + '20' }]}>
            <Feather name="file-text" size={30} color={colors.headerBg} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>Catatan Sederhana</Text>
          <Text style={[styles.subtitle, { color: colors.textSec }]}>
            {isSignUp ? 'Buat akun baru untuk memulai' : 'Masuk ke akun Anda'}
          </Text>

          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Nama Lengkap</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Feather name="user" size={18} color={colors.placeholder} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Masukkan nama lengkap"
                  placeholderTextColor={colors.placeholder}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Email</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Feather name="mail" size={18} color={colors.placeholder} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="contoh@email.com"
                placeholderTextColor={colors.placeholder}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Feather name="lock" size={18} color={colors.placeholder} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Masukkan password"
                placeholderTextColor={colors.placeholder}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={18}
                  color={colors.placeholder}
                />
              </TouchableOpacity>
            </View>
          </View>

          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Konfirmasi Password</Text>
              <View style={[styles.inputWrapper, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Feather name="lock" size={18} color={colors.placeholder} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Ulangi password"
                  placeholderTextColor={colors.placeholder}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.headerBg }, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Feather name="log-in" size={18} color="#fff" />
            <Text style={styles.buttonText}>
              {loading ? 'Memproses...' : isSignUp ? 'Daftar Sekarang' : 'Masuk'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.placeholder }]}>atau</Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          <TouchableOpacity style={styles.toggleBtn} onPress={toggleMode}>
            <Text style={[styles.toggleText, { color: colors.textSec }]}>
              {isSignUp ? 'Sudah punya akun? ' : 'Belum punya akun? '}
              <Text style={[styles.toggleHighlight, { color: colors.headerBg }]}>
                {isSignUp ? 'Masuk' : 'Daftar'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    borderRadius: 20,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    marginLeft: 10,
  },
  eyeBtn: {
    padding: 4,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 13,
  },
  toggleBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 14,
  },
  toggleHighlight: {
    fontWeight: '700',
  },
});
