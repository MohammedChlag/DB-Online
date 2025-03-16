import React, { useEffect, useState } from 'react';
import { useAuthHook } from '../../hooks/useAuthHook';
import { Link } from 'react-router-dom';

// Imports de iconos
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/outline';

// Imports de services
import { getAssessmentsService } from '../../services/fetchAssessmentsApi.js';
import { getUserByIdService } from '../../services/fetchUserApi.js';
import { deleteAssessmentService } from '../../services/fetchAssessmentsApi.js';

// Import de modal
import { DeleteConfirmModal } from '../layout/Modals/DeleteConfirmModal';

export const AssessmentPreview = () => {
    const { isAdmin, token } = useAuthHook();
    const [assessments, setAssessments] = useState([]);
    const [topAssessments, setTopAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userDetails, setUserDetails] = useState({});
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [assessmentToDelete, setAssessmentToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(null);

    const fetchAssessments = async () => {
        try {
            setLoading(true);
            const data = await getAssessmentsService();
            const assessmentsList = data.result || [];
            setAssessments(assessmentsList);

            // Guardamos la información de si no hay valoraciones
            if (data.noAssessments) {
                setError('no-assessments'); // Usamos un código especial para identificar este caso
            } else if (assessmentsList.length > 0) {
                await fetchUserDetails(assessmentsList);
            }
        } catch (err) {
            console.error('Error al cargar las valoraciones:', err);
            setError('No se pudieron cargar las valoraciones.');
        } finally {
            setLoading(false);
        }
    };

    // Funcion para conseguir Username y Avatar
    const fetchUserDetails = async (assessmentsList) => {
        try {
            const uniqueUserIds = [
                ...new Set(
                    assessmentsList.map((a) => a.userId).filter(Boolean)
                ),
            ];

            const userDetailsMap = { ...userDetails };
            for (const userId of uniqueUserIds) {
                if (!userDetailsMap[userId]) {
                    try {
                        const { user } = await getUserByIdService(userId);
                        if (user) {
                            userDetailsMap[userId] = {
                                username: user.username || 'Usuario',
                                avatar: user.avatarUrl || user.avatar || null,
                            };
                            console.log(
                                'Usuario obtenido:',
                                user.username,
                                'para ID:',
                                userId
                            );
                        }
                    } catch (error) {
                        console.error(
                            `Error al obtener detalles del usuario ${userId}:`,
                            error
                        );
                        userDetailsMap[userId] = {
                            username: 'Usuario desconocido',
                            avatar: null,
                        };
                    }
                }
            }
            setUserDetails(userDetailsMap);
        } catch (err) {
            console.error('Error al obtener detalles de usuarios:', err);
        }
    };

    const getUserDetails = (userId) => {
        return userDetails[userId] || { username: 'Usuario', avatar: null };
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }).map((_, index) => {
            if (index < rating) {
                return (
                    <StarSolid
                        key={index}
                        className="h-4 w-4 text-yellow-400"
                        aria-hidden="true"
                    />
                );
            }
            return (
                <StarOutline
                    key={index}
                    className="h-4 w-4 text-yellow-400"
                    aria-hidden="true"
                />
            );
        });
    };

    const calculateAverageRating = () => {
        if (assessments.length === 0) return 0;
        const sum = assessments.reduce(
            (acc, assessment) => acc + assessment.vote,
            0
        );
        return (sum / assessments.length).toFixed(1);
    };

    useEffect(() => {
        if (assessments.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex((prevIndex) =>
                    prevIndex === assessments.length - 1 ? 0 : prevIndex + 1
                );
            }, 5000);

            return () => clearInterval(interval);
        }
    }, [assessments.length]);

    useEffect(() => {
        fetchAssessments();
    }, []);

    const getTopAssessments = () => {
        return assessments
            .filter((assessment) => assessment.comment)
            .sort((a, b) => b.vote - a.vote)
            .slice(0, 5);
    };

    const handleOpenDeleteModal = (assessmentId, e) => {
        // Detener la propagación del evento para evitar cambiar el carrusel
        if (e) e.stopPropagation();

        setAssessmentToDelete(assessmentId);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setAssessmentToDelete(null);
    };

    const handleDeleteAssessment = async () => {
        if (!assessmentToDelete) return;

        try {
            setDeleteLoading(true);
            setDeleteError(null);
            setDeleteSuccess(null);

            await deleteAssessmentService(assessmentToDelete, token);

            // Actualizar el estado local removiendo la valoración eliminada
            setAssessments((prevAssessments) =>
                prevAssessments.filter(
                    (assessment) => assessment.id !== assessmentToDelete
                )
            );

            // Actualizar también las valoraciones destacadas
            setTopAssessments((prevTopAssessments) =>
                prevTopAssessments.filter(
                    (assessment) => assessment.id !== assessmentToDelete
                )
            );

            setDeleteSuccess('Valoración eliminada correctamente');

            // Ocultar el mensaje de éxito después de 3 segundos
            setTimeout(() => {
                setDeleteSuccess(null);
            }, 3000);

            // Cerrar el modal de confirmación
            handleCloseDeleteModal();
        } catch (error) {
            console.error('Error al eliminar la valoración:', error);
            setDeleteError(error.message || 'Error al eliminar la valoración');

            // Ocultar el mensaje de error después de 3 segundos
            setTimeout(() => {
                setDeleteError(null);
            }, 3000);

            // Cerrar el modal de confirmación
            handleCloseDeleteModal();
        } finally {
            setDeleteLoading(false);
        }
    };

    useEffect(() => {
        const topAssessmentsList = getTopAssessments();
        setTopAssessments(topAssessmentsList);
    }, [assessments]);

    const averageRating = calculateAverageRating();

    if (loading) {
        return (
            <div className="text-center py-3">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#009EB5]"></div>
            </div>
        );
    }

    if (error) {
        // Si es el caso especial de "no hay valoraciones", mostramos un mensaje amigable
        if (error === 'no-assessments') {
            return (
                <section className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 text-center py-3">
                    <h4 className="text-base font-semibold text-gray-800 mb-2">
                        <span className="text-[#009EB5]">★</span> Aún no hay
                        valoraciones
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                        ¡Sé el primero en compartir tu experiencia con Hackloud!
                    </p>
                    <Link
                        to="/assessments"
                        className="inline-block px-4 py-2 bg-[#009EB5] text-white rounded-md text-sm font-medium hover:bg-[#008a9c] transition-colors"
                    >
                        Dejar una valoración
                    </Link>
                </section>
            );
        }

        // Para otros errores, mostramos el mensaje generico
        return (
            <section className="text-center py-3 text-gray-600 text-sm">
                <p>No se pudieron cargar las valoraciones en este momento.</p>
            </section>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {/* Mensajes de estado para eliminación */}
            {deleteLoading && (
                <div className="col-span-1 lg:col-span-2 bg-blue-100 border border-blue-300 text-blue-700 px-4 py-2 rounded mb-2 flex items-center justify-center text-xs sm:text-sm">
                    <div className="inline-block animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-blue-700 mr-2"></div>
                    <span>Eliminando valoración...</span>
                </div>
            )}

            {deleteError && (
                <div className="col-span-1 lg:col-span-2 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded mb-2 text-xs sm:text-sm">
                    {deleteError}
                </div>
            )}

            {deleteSuccess && (
                <div className="col-span-1 lg:col-span-2 bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded mb-2 text-xs sm:text-sm">
                    {deleteSuccess}
                </div>
            )}

            {/* Resumen de valoraciones */}
            <article className="flex flex-col items-center gap-2 bg-white dark:bg-[#1f1f1f] rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-gray-500 hover:shadow-md transition-shadow">
                <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white mb-1 sm:mb-2">
                    <span className="text-[#009EB5]">★</span> Puntuación global
                </h4>
                <span className="text-xl sm:text-2xl font-bold text-[#009EB5] mr-2">
                    {averageRating}
                </span>
                <div className="flex">
                    {renderStars(Math.round(averageRating))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Basado en {assessments.length} valoraciones
                </p>
                <Link
                    to="/assessments"
                    className="mt-1 sm:mt-2 text-xs text-[#009EB5] hover:underline font-medium"
                >
                    Ver todas las valoraciones →
                </Link>
            </article>

            {/* Carrusel de valoraciones */}
            {topAssessments.length > 0 && (
                <section className="bg-white dark:bg-[#1f1f1f] rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-gray-500 hover:shadow-md transition-shadow">
                    <h4 className="text-sm sm:text-base font-semibold text-gray-800 dark:text-white mb-1 sm:mb-2">
                        <span className="text-[#009EB5]">❝</span> Experiencias
                        reales
                    </h4>

                    <figure className="relative overflow-hidden">
                        <div className="transition-opacity duration-500">
                            {topAssessments.map((assessment, index) => (
                                <figcaption
                                    key={index}
                                    className={`${
                                        index ===
                                        currentIndex % topAssessments.length
                                            ? 'block'
                                            : 'hidden'
                                    } relative`}
                                >
                                    {/* Botón de eliminar para administradores */}
                                    {isAdmin && (
                                        <button
                                            onClick={(e) =>
                                                handleOpenDeleteModal(
                                                    assessment.id,
                                                    e
                                                )
                                            }
                                            className="absolute top-0 right-0 text-gray-400 hover:text-red-500 transition-colors p-1"
                                            title="Eliminar valoración"
                                            disabled={deleteLoading}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </button>
                                    )}
                                    <div className="flex mb-1">
                                        {renderStars(assessment.vote)}
                                    </div>

                                    <section className="h-14 sm:h-16 overflow-y-auto mb-1">
                                        <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                                            {assessment.comment}
                                        </p>
                                    </section>

                                    <section className="flex items-center mt-1 pt-1 border-t border-gray-100 dark:border-gray-500">
                                        {assessment.userId ? (
                                            <>
                                                {(() => {
                                                    const { username, avatar } =
                                                        getUserDetails(
                                                            assessment.userId
                                                        );
                                                    return (
                                                        <>
                                                            {avatar ? (
                                                                <img
                                                                    src={avatar}
                                                                    alt={`Avatar de ${username}`}
                                                                    className="w-6 h-6 sm:w-8 sm:h-8 rounded-full mr-2 object-cover border border-gray-200"
                                                                    onError={(
                                                                        e
                                                                    ) => {
                                                                        e.target.style.display =
                                                                            'none';
                                                                        e.target.nextElementSibling.style.display =
                                                                            'flex';
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <div
                                                                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 border border-gray-200"
                                                                style={{
                                                                    display:
                                                                        avatar
                                                                            ? 'none'
                                                                            : 'flex',
                                                                }}
                                                            >
                                                                <span className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium">
                                                                    {username
                                                                        .charAt(
                                                                            0
                                                                        )
                                                                        .toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <span className="text-xs sm:text-base text-gray-700 dark:text-gray-400 font-medium">
                                                                {username}
                                                            </span>
                                                        </>
                                                    );
                                                })()}
                                            </>
                                        ) : (
                                            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                                Usuario: Anónimo
                                            </p>
                                        )}
                                    </section>
                                </figcaption>
                            ))}
                        </div>

                        {/* Indicadores de navegación */}
                        <footer className="flex justify-center mt-1 sm:mt-2 space-x-1">
                            {topAssessments.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-1 sm:h-1.5 w-1 sm:w-1.5 rounded-full ${
                                        index ===
                                        currentIndex % topAssessments.length
                                            ? 'bg-[#009EB5]'
                                            : 'bg-gray-300'
                                    }`}
                                    aria-label={`Ir a la valoración ${
                                        index + 1
                                    }`}
                                />
                            ))}
                        </footer>
                    </figure>
                </section>
            )}

            {/* Modal de confirmación de eliminación */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteAssessment}
                type="assessment"
            />
        </div>
    );
};
