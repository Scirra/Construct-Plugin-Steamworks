cmake_minimum_required(VERSION 3.10)
project(SteamWrapperExtension)

add_library(steam_wrapper_extension SHARED WrapperExtension.cpp Utils.cpp SteamCallbacks.cpp)

set_target_properties(steam_wrapper_extension PROPERTIES LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
