{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "cert.accesstoken" -}}
{{- .Values.accesstoken | trunc 63 | trimSuffix "-" -}}
{{- end -}}
