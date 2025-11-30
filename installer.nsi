!include "MUI2.nsh"
!include "logiclib.nsh"

!define NAME "OpenExonautClient"
!define APPFILE "OpenExonautClient.bat"
!define VERSION "0.9.0"
!define SLUG "${NAME} ${VERSION}"

Name "${NAME}"
OutFile "dist\${NAME}-Windows-Installer-${VERSION}.exe"
InstallDir "$LOCALAPPDATA\Programs\${NAME}"
InstallDirRegKey HKCU "Software\${NAME}" ""
RequestExecutionLevel user

!define MUI_ICON "build\icon.ico"
!define MUI_ABORTWARNING
!define MUI_WELCOMEPAGE_TITLE "${SLUG} Setup"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "LICENSE.md"
!insertmacro MUI_PAGE_COMPONENTS
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "English"

Section "-hidden app"
  SectionIn RO
  SetOutPath "$INSTDIR"
  File /r "dist\win\OpenExonautClient\*.*"
  WriteRegStr HKCU "Software\${NAME}" "" $INSTDIR
  WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Desktop Shortcut" DeskShort
  CreateShortCut "$DESKTOP\${NAME}.lnk" "$INSTDIR\${APPFILE}" "" "$INSTDIR\icon.ico"
SectionEnd

LangString DESC_DeskShort ${LANG_ENGLISH} "Create Shortcut on Desktop."

!insertmacro MUI_FUNCTION_DESCRIPTION_BEGIN
  !insertmacro MUI_DESCRIPTION_TEXT ${DeskShort} $(DESC_DeskShort)
!insertmacro MUI_FUNCTION_DESCRIPTION_END

Function un.RMDirUP
  !define RMDirUP '!insertmacro RMDirUPCall'

  !macro RMDirUPCall _PATH
    push '${_PATH}'
    Call un.RMDirUP
  !macroend

  ClearErrors

  Exch $0
  RMDir "$0\.."
  IfErrors Skip
  ${RMDirUP} "$0\.."
  Skip:

  Pop $0
FunctionEnd

Section "Uninstall"
  Delete "$DESKTOP\${NAME}.lnk"
  Delete "$INSTDIR\Uninstall.exe"
  RMDir /r "$INSTDIR"
  ${RMDirUP} "$INSTDIR"
  DeleteRegKey /ifempty HKCU "Software\${NAME}"
SectionEnd
