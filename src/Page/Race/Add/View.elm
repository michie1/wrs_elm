module Page.Race.Add.View exposing (view)

import Html exposing (Html, p, button, span, div, input, i, h2)
import Html.Attributes exposing (value, autofocus, class, name, type_, id, for, checked, disabled)
import Html.Events exposing (onClick, onInput)
import Date exposing (day)
import Date.Extra.Format
import Date.Extra.Config.Config_nl_nl exposing (config)
import DatePicker
import Data.RaceType as RaceType exposing (RaceType)
import Page.Race.Add.Model exposing (Model)
import Page.Race.Add.Msg as Msg exposing (Msg)


label : String -> Html Msg
label text =
    div [ class "field-label" ] [ Html.label [ class "label" ] [ Html.text text ] ]


field : List (Html Msg) -> Html Msg
field body =
    div [ class "field-body" ]
        [ div [ class "control" ] body ]


horizontal : List (Html Msg) -> Html Msg
horizontal body =
    div [ class "field is-horizontal" ] body


dateFormat : Date.Date -> String
dateFormat date =
    Date.Extra.Format.format config "%Y-%m-%d" date

settings : DatePicker.Settings
settings =
    let
        defaultSettings = DatePicker.defaultSettings
    in
        { defaultSettings 
            | dateFormatter = dateFormat
            , firstDayOfWeek = Date.Mon
        }

view : Model -> Html Msg
view raceAdd =
    let
        raceName =
            raceAdd.name

        submitDisabled =
            raceName == "" || String.length raceName > 100
    in
        div []
            [ h2 [ class "title is-2" ] [ Html.text "Add Race" ]
            , horizontal
                [ label "Name"
                , field [ input [ id "name", type_ "text", onInput Msg.Name, autofocus True, value raceName ] [] ]
                ]
            , horizontal
                [ label "Category"
                , field [ raceTypeButtons raceAdd.raceType ]
                ]
            , horizontal
                [ label "Date"
                , field [ DatePicker.view raceAdd.date settings raceAdd.datePicker |> Html.map Msg.ToDatePicker ]
                ]
            , horizontal
                [ label ""
                , field [ button
                            [ class "button"
                            , type_ "submit"
                            , onClick Msg.Submit
                            , Html.Attributes.name "action"
                            , disabled submitDisabled
                            ]
                            [ Html.text "Add Race" ]
                        ]
                ]
            ]


raceTypeButtonCheck : String -> String -> RaceType -> RaceType -> Html Msg
raceTypeButtonCheck raceTypeName raceTypeText raceType current =
    let
        isChecked =
            raceType == current
    in
        p []
            [ input [ checked isChecked, name "type", type_ "radio", id raceTypeName, onClick (Msg.RaceType raceType) ] []
            , Html.label [ for raceTypeName ] [ Html.text raceTypeText ]
            ]


raceTypeButtons : RaceType -> Html Msg
raceTypeButtons current =
    div [ class "col s6" ]
        [ raceTypeButtonCheck "classic" "Klassieker" RaceType.Classic current
        , raceTypeButtonCheck "criterum" "Criterium" RaceType.Criterium current
        , raceTypeButtonCheck "regiocross" "Regiocross" RaceType.Regiocross current
        , raceTypeButtonCheck "other" "Other" RaceType.Other current
        ]
