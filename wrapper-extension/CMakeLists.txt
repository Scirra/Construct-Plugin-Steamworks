cmake_minimum_required(VERSION 3.10)
project(SteamWrapperExtension)

add_library(steam_wrapper_extension SHARED WrapperExtension.cpp Utils.cpp SteamCallbacks.cpp)

target_link_libraries(steam_wrapper_extension PUBLIC "${CMAKE_CURRENT_SOURCE_DIR}/steamworks-sdk/redistributable_bin/linux64/libsteam_api.so")

set_target_properties(steam_wrapper_extension PROPERTIES LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
