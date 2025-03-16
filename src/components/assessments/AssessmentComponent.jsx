import React, { useEffect, useState } from 'react';

import { useAuthHook } from '../../hooks/useAuthHook';

// Imports de iconos
import { StarIcon as StarOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Button } from '../layout/Button.jsx';

// Imports de services
import { getAssessmentsService } from '../../services/fetchAssessmentsApi.js';
import { getUserByIdService } from '../../services/fetchUserApi.js';
import { deleteAssessmentService } from '../../services/fetchAssessmentsApi.js';

// Imports de modals
import { DeleteConfirmModal } from '../layout/Modals/DeleteConfirmModal';
import { AssessmentsModal } from '../layout/Modals/AssessmentsModal.jsx';

export const AssessmentComponent = () => {
    const { currentUser, token, isAdmin } = useAuthHook();
    const [assessments, setAssessments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userDetails, setUserDetails] = useState({}); // Almacena detalles de usuarios por ID
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [assessmentToDelete, setAssessmentToDelete] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteError, setDeleteError] = useState(null);
    const [deleteSuccess, setDeleteSuccess] = useState(null);

    const fetchAssessments = async () => {
        try {
            setLoading(true);
            const data = await getAssessmentsService();
            console.log('AssessmentComponent - Datos recibidos:', data);

            // Establecer las valoraciones desde data.result
            const assessmentsList = data.result || [];
            setAssessments(assessmentsList);

            // Obtener información de los usuarios
            if (assessmentsList.length > 0) {
                await fetchUserDetails(assessmentsList);
            }
        } catch (err) {
            console.error('Error al cargar las valoraciones:', err);
            setError(
                'No se pudieron cargar las valoraciones. Por favor, inténtalo de nuevo más tarde.'
            );
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener detalles de usuarios
    const fetchUserDetails = async (assessmentsList) => {
        try {
            // Crear un conjunto de IDs únicos para evitar solicitudes duplicadas
            const uniqueUserIds = [
                ...new Set(
                    assessmentsList.map((a) => a.userId).filter(Boolean)
                ),
            ];
            console.log('IDs de usuario únicos:', uniqueUserIds);

            // Objeto para almacenar los detalles de usuario
            const userDetailsObj = {};

            // Obtener detalles de cada usuario
            for (const userId of uniqueUserIds) {
                try {
                    console.log('Obteniendo detalles del usuario:', userId);
                    const { user } = await getUserByIdService(userId);
                    userDetailsObj[userId] = user;
                    console.log(
                        'Detalles obtenidos para el usuario:',
                        userId,
                        user
                    );
                } catch (error) {
                    console.error(
                        `Error al obtener detalles del usuario ${userId}:`,
                        error
                    );
                    // Si hay error, guardar un objeto vacío para este usuario
                    userDetailsObj[userId] = {
                        username: 'Usuario desconocido',
                        avatar: null,
                    };
                }
            }

            console.log('Detalles de usuarios obtenidos:', userDetailsObj);
            setUserDetails(userDetailsObj);
        } catch (error) {
            console.error('Error al obtener detalles de usuarios:', error);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, []);

    // Función para renderizar estrellas según la puntuación
    const renderStars = (vote) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= vote) {
                stars.push(
                    <StarSolid key={i} className="h-5 w-5 text-yellow-500" />
                );
            } else {
                stars.push(
                    <StarOutline key={i} className="h-5 w-5 text-yellow-500" />
                );
            }
        }
        return stars;
    };

    // Calcular la valoración media
    const averageRating =
        assessments.length > 0
            ? (
                  assessments.reduce((sum, item) => sum + item.vote, 0) /
                  assessments.length
              ).toFixed(1)
            : 0;

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAssessmentCreated = () => {
        // Recargar las valoraciones después de crear una nueva
        fetchAssessments();
    };

    // Obtener el avatar y nombre de usuario
    const getUserInfo = (userId) => {
        if (!userId) return { username: 'Anónimo', avatar: null };

        const userInfo = userDetails[userId] || {};
        return {
            username: userInfo.username || userId.substring(0, 8) || 'Anónimo',
            avatar: userInfo.avatarUrl || null,
        };
    };

    // Función para abrir el modal de confirmación de eliminación
    const handleOpenDeleteModal = (assessmentId) => {
        setAssessmentToDelete(assessmentId);
        setDeleteModalOpen(true);
    };

    // Función para cerrar el modal de confirmación
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setAssessmentToDelete(null);
    };

    // Función para eliminar una valoración
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

    return (
        <section className="assessment-component">
            {/* Botón para valorar */}
            <div className="flex justify-center mb-10">
                <Button
                    handleClick={handleOpenModal}
                    className="py-3 px-8 text-white bg-[#009EB5] hover:bg-[#008ca1] rounded-md shadow-md transition-colors duration-300 text-base font-medium"
                >
                    Valorar Hackloud
                </Button>
            </div>

            {/* Mensajes de estado para eliminación */}
            {deleteLoading && (
                <div className="bg-blue-100 border border-blue-300 text-blue-700 px-4 py-3 rounded mb-4 flex items-center justify-center">
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-700 mr-2"></div>
                    <span>Eliminando valoración...</span>
                </div>
            )}

            {deleteError && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded mb-4">
                    {deleteError}
                </div>
            )}

            {deleteSuccess && (
                <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded mb-4">
                    {deleteSuccess}
                </div>
            )}

            {/* Resumen de valoraciones */}
            {!loading && !error && assessments.length > 0 && (
                <article className="bg-[#e6f7f9] dark:bg-[#283e45] rounded-lg p-8 mb-12 shadow-sm">
                    <div className="flex flex-col lg:flex-row items-center justify-around gap-8">
                        <section className="text-center lg:text-left">
                            <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                                Valoración media
                            </h2>
                            <div className="flex items-center justify-center lg:justify-start">
                                <span className="text-5xl font-bold text-[#009EB5] mr-4">
                                    {averageRating}
                                </span>
                                <div className="flex">
                                    {renderStars(Math.round(averageRating))}
                                </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-3">
                                Basado en {assessments.length} valoraciones
                            </p>
                        </section>
                        <section className="bg-white dark:bg-[#222222] p-6 rounded-lg shadow-sm w-full lg:w-auto">
                            <h3 className="text-lg font-medium text-gray-700 dark:text-white mb-4">
                                Distribución de valoraciones
                            </h3>
                            <article className="flex items-center space-x-1 mb-3">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <StarSolid
                                            key={star}
                                            className="h-4 w-4 text-yellow-500"
                                        />
                                    ))}
                                </div>
                                <div className="w-48 h-3 bg-gray-200  dark:bg-gray-600 rounded-full overflow-hidden ml-2">
                                    <div
                                        className="h-full bg-[#009EB5]"
                                        style={{
                                            width: `${
                                                (assessments.filter(
                                                    (a) => a.vote === 5
                                                ).length /
                                                    assessments.length) *
                                                100
                                            }%`,
                                        }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-500 ml-2 min-w-[20px] text-right">
                                    {
                                        assessments.filter((a) => a.vote === 5)
                                            .length
                                    }
                                </span>
                            </article>
                            {[4, 3, 2, 1].map((rating) => (
                                <article
                                    key={rating}
                                    className="flex items-center space-x-1 mb-3"
                                >
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <StarSolid
                                                key={star}
                                                className={`h-4 w-4 ${
                                                    star <= rating
                                                        ? 'text-yellow-500'
                                                        : 'text-gray-300 dark:text-gray-400'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <div className="w-48 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden ml-2">
                                        <div
                                            className="h-full bg-[#009EB5]"
                                            style={{
                                                width: `${
                                                    (assessments.filter(
                                                        (a) => a.vote === rating
                                                    ).length /
                                                        assessments.length) *
                                                    100
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 min-w-[20px] text-right">
                                        {
                                            assessments.filter(
                                                (a) => a.vote === rating
                                            ).length
                                        }
                                    </span>
                                </article>
                            ))}
                        </section>
                    </div>
                </article>
            )}

            {/* Estado de carga */}
            {loading && (
                <section className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#009EB5]"></div>
                    <p className="mt-4 text-gray-600 font-medium">
                        Cargando valoraciones...
                    </p>
                </section>
            )}

            {/* Mensaje de error */}
            {error && (
                <div className="text-center py-16">
                    <div className="bg-red-100 border border-red-200 text-red-700 px-6 py-4 rounded-lg max-w-lg mx-auto">
                        <p className="font-medium">{error}</p>
                    </div>
                </div>
            )}

            {/* Lista de valoraciones */}
            {!loading && !error && (
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {assessments.length > 0 ? (
                        assessments.map((assessment, index) => (
                            <article
                                key={index}
                                className="bg-white dark:bg-[#2c2c2c] rounded-lg shadow-sm p-6 border border-gray-100 dark:border-[#494949] flex flex-col transition-transform duration-300 hover:shadow-md hover:-translate-y-1 relative"
                            >
                                <header className="flex items-center justify-between mb-4">
                                    <div className="flex">
                                        {renderStars(assessment.vote)}
                                    </div>
                                    <div className="flex items-center">
                                        <time
                                            className="text-gray-500 dark:text-gray-400 text-sm mr-2"
                                            dateTime={assessment.createdAt}
                                        >
                                            {assessment.createdAt
                                                ? new Date(
                                                      assessment.createdAt
                                                  ).toLocaleDateString()
                                                : 'Fecha no disponible'}
                                        </time>
                                        {/* Botón de eliminar para administradores */}
                                        {isAdmin && (
                                            <button
                                                onClick={() =>
                                                    handleOpenDeleteModal(
                                                        assessment.id
                                                    )
                                                }
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                title="Eliminar valoración"
                                                disabled={deleteLoading}
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        )}
                                    </div>
                                </header>

                                <div className="flex-grow">
                                    {assessment.comment ? (
                                        <p className="text-gray-700 dark:text-gray-300 mb-4">
                                            {assessment.comment}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400 italic mb-4">
                                            Sin comentario
                                        </p>
                                    )}
                                </div>

                                <footer className="mt-auto pt-4 border-t border-gray-100 dark:border-[#494949]">
                                    {assessment.userId ? (
                                        <div className="flex items-center">
                                            {(() => {
                                                const { username, avatar } =
                                                    getUserInfo(
                                                        assessment.userId
                                                    );
                                                return (
                                                    <>
                                                        {avatar ? (
                                                            <img
                                                                src={avatar}
                                                                alt={`Avatar de ${username}`}
                                                                className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
                                                                onError={(
                                                                    e
                                                                ) => {
                                                                    // Si la imagen falla al cargar, mostrar la inicial
                                                                    e.target.style.display =
                                                                        'none';
                                                                    e.target.nextSibling.style.display =
                                                                        'flex';
                                                                }}
                                                            />
                                                        ) : null}
                                                        <div
                                                            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 border border-gray-200"
                                                            style={{
                                                                display: avatar
                                                                    ? 'none'
                                                                    : 'flex',
                                                            }}
                                                        >
                                                            <span className="text-gray-600 text-sm font-medium">
                                                                {username
                                                                    .charAt(0)
                                                                    .toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-700 dark:text-gray-400 font-medium">
                                                            {username}
                                                        </p>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Usuario: Anónimo
                                        </p>
                                    )}
                                </footer>
                            </article>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <p className="text-gray-500 text-lg">
                                Aún no hay valoraciones. ¡Sé el primero en
                                valorar nuestra aplicación!
                            </p>
                        </div>
                    )}
                </section>
            )}

            {/* Modal de valoración */}
            <AssessmentsModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                currentUser={currentUser}
                token={token}
                onAssessmentCreated={handleAssessmentCreated}
            />

            {/* Modal de confirmación de eliminación */}
            <DeleteConfirmModal
                isOpen={deleteModalOpen}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteAssessment}
                type="assessment"
            />
        </section>
    );
};
