// src/auth/pages/Signup.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { 
  Hotel, 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Building,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react'
import logo from '../../assets/ghLogo.png' // Chez correct

const Signup = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    hireDate: '',
    role: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  })

  // Validation du mot de passe
  const validatePassword = (password) => {
    const feedback = []
    let score = 0

    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('Au moins 8 caractères')
    }

    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Une majuscule')
    }

    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Une minuscule')
    }

    if (/[0-9]/.test(password)) {
      score += 1
    } else {
      feedback.push('Un chiffre')
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1
    } else {
      feedback.push('Un caractère spécial')
    }

    return { score, feedback }
  }

  const handlePasswordChange = (password) => {
    setPasswordStrength(validatePassword(password))
  }

  const getPasswordStrengthColor = (score) => {
    if (score === 0) return 'bg-gray-200'
    if (score <= 2) return 'bg-red-500'
    if (score <= 3) return 'bg-yellow-500'
    if (score <= 4) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = (score) => {
    if (score === 0) return 'Non évalué'
    if (score <= 2) return 'Faible'
    if (score <= 3) return 'Moyen'
    if (score <= 4) return 'Fort'
    return 'Très fort'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validation complète
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      setLoading(false)
      return
    }

    if (passwordStrength.score < 3) {
      setError('Le mot de passe est trop faible. Veuillez renforcer votre mot de passe.')
      setLoading(false)
      return
    }

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.department || !formData.role) {
      setError('Veuillez remplir tous les champs obligatoires')
      setLoading(false)
      return
    }

    // Validation email professionnel
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Veuillez entrer une adresse email valide')
      setLoading(false)
      return
    }

    try {
      // Simulation de création de compte avec vérification
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Vérification si l'email existe déjà (simulation)
      const existingUsers = ['admin@grandhotel.com', 'manager@grandhotel.com']
      if (existingUsers.includes(formData.email)) {
        setError('Cette adresse email est déjà utilisée')
        setLoading(false)
        return
      }

      // En production, cela enverrait une requête au serveur
      const userData = {
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        status: 'pending',
        createdAt: new Date().toISOString(),
        permissions: getDefaultPermissions(formData.role)
      }
      
      console.log('Compte créé:', userData)
      
      // Message de succès
      setSuccess('Votre compte a été créé avec succès ! En attente de validation par un administrateur.')
      
      // Redirection après délai
      setTimeout(() => {
        navigate('/login?message=account_created')
      }, 3000)
      
    } catch (err) {
      setError('Une erreur est survenue lors de la création du compte. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  const getDefaultPermissions = (role) => {
    const permissions = {
      'reception': ['gestion_reservations', 'gestion_clients'],
      'housekeeping': ['gestion_menage'],
      'manager': ['gestion_reservations', 'gestion_clients', 'gestion_utilisateurs', 'rapports'],
      'admin': ['all']
    }
    return permissions[role] || []
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })

    if (name === 'password') {
      handlePasswordChange(value)
    }
  }

  const departments = [
    { value: 'reception', label: 'Réception' },
    { value: 'housekeeping', label: 'Service de ménage' },
    { value: 'restaurant', label: 'Restauration' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'management', label: 'Direction' },
    { value: 'other', label: 'Autre' }
  ]

  const roles = {
    'reception': [
      { value: 'reception', label: 'Réceptionniste' },
      { value: 'supervisor', label: 'Superviseur réception' }
    ],
    'housekeeping': [
      { value: 'housekeeping', label: 'Agent de ménage' },
      { value: 'supervisor', label: 'Superviseur ménage' }
    ],
    'restaurant': [
      { value: 'server', label: 'Serveur' },
      { value: 'chef', label: 'Chef de cuisine' }
    ],
    'maintenance': [
      { value: 'technician', label: 'Technicien' }
    ],
    'management': [
      { value: 'manager', label: 'Gérant' },
      { value: 'admin', label: 'Administrateur' }
    ],
    'other': [
      { value: 'other', label: 'Autre' }
    ]
  }

  const getRolesForDepartment = (department) => {
    return roles[department] || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 py-8">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className=" rounded-lg flex items-center justify-center ">
                                 <img 
                                   src={logo} // Utilisez la variable importée directement
                                   alt="Grand Hotel Logo" 
                                   className=" w-28 object-contain" // Ajustez selon votre logo
                                 />
                               </div>
          <p className="text-gray-600">Créez votre un compte professionnel</p>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center">
                <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                {success}
              </div>
            )}

            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Votre prénom"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom *
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Votre nom"
                />
              </div>
            </div>

            {/* Email et Téléphone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email professionnel *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="votre@hotel.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+33 1 23 45 67 89"
                  />
                </div>
              </div>
            </div>

            {/* Département et Poste */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                  Département *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="department"
                    name="department"
                    required
                    value={formData.department}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Sélectionnez un département</option>
                    {departments.map(dept => (
                      <option key={dept.value} value={dept.value}>
                        {dept.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                  Poste *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  disabled={!formData.department}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                >
                  <option value="">Sélectionnez un poste</option>
                  {getRolesForDepartment(formData.department).map(role => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date d'embauche */}
            <div>
              <label htmlFor="hireDate" className="block text-sm font-medium text-gray-700 mb-2">
                Date d'embauche
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Minimum 8 caractères"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Indicateur de force du mot de passe */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Force du mot de passe:</span>
                      <span className={`font-medium ${
                        passwordStrength.score <= 2 ? 'text-red-600' :
                        passwordStrength.score <= 3 ? 'text-yellow-600' :
                        passwordStrength.score <= 4 ? 'text-blue-600' : 'text-green-600'
                      }`}>
                        {getPasswordStrengthText(passwordStrength.score)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor(passwordStrength.score)}`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-xs text-gray-600">
                      {passwordStrength.feedback.map((item, index) => (
                        <div key={index} className="flex items-center">
                          <XCircle className="w-3 h-3 text-red-500 mr-1" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirmez votre mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <div className="mt-2 flex items-center text-green-600 text-xs">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Les mots de passe correspondent
                  </div>
                )}
              </div>
            </div>

            {/* Conditions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                />
                <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                  <span className="font-medium">Conditions d'utilisation</span>
                  <p className="mt-1">
                    Je certifie que les informations fournies sont exactes et j'accepte les{' '}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-500 underline">
                      conditions d'utilisation
                    </Link>{' '}
                    et la{' '}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                      politique de confidentialité
                    </Link>{' '}
                    de Grand Hotel. Je comprends que mon compte doit être validé par un administrateur.
                  </p>
                </label>
              </div>
            </div>

            {/* Bouton d'inscription */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 font-medium"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Création du compte...
                </div>
              ) : (
                'Créer mon compte professionnel'
              )}
            </button>
          </form>

          {/* Lien vers la connexion */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Déjà membre de Grand Hotel ?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-500">
          <div className="text-center">
            <p>✓ Validation administrative requise</p>
          </div>
          <div className="text-center">
            <p>✓ Accès sous 24-48h après validation</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup