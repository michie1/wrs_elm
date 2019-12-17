module Page.Race.Add.View exposing (view)

import Data.RaceType exposing (RaceType, raceTypeReadable, raceTypeToString, raceTypes)
import DatePicker
import Html exposing (Html, button, div, h2, input, p)
import Html.Attributes exposing (autofocus, checked, class, disabled, for, id, name, type_, value)
import Html.Events exposing (onClick, onInput)
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


settings : DatePicker.Settings
settings =
    DatePicker.defaultSettings


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
            , field
                [ button
                    [ class "button"
                    , type_ "submit"
                    , onClick Msg.Submit
                    , disabled submitDisabled
                    ]
                    [ Html.text "Add Race" ]
                ]
            ]
        ]


raceTypeButtonCheck : RaceType -> RaceType -> Html Msg
raceTypeButtonCheck raceType current =
    let
        isChecked =
            raceType == current

        raceTypeName =
            raceTypeToString raceType

        raceTypeText =
            raceTypeReadable raceType
    in
    p []
        [ input [ checked isChecked, name "type", type_ "radio", id raceTypeName, onClick (Msg.RaceType raceType) ] []
        , Html.label [ for raceTypeName ] [ Html.text raceTypeText ]
        ]


raceTypeButtons : RaceType -> Html Msg
raceTypeButtons current =
    div [ class "col s6" ] <|
        List.map (\raceType -> raceTypeButtonCheck raceType current) raceTypes
